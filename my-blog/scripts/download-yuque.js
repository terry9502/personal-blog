const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const crypto = require('crypto');

// 配置项
const CONFIG = {
  imagesDir: 'public/images',
  postsDir: 'src/content/posts',
  baseUrl: '/images',
  maxRetries: 3,
  downloadDelay: 800, // 下载间隔，避免触发限制
  timeout: 30000
};

let downloadedImages = new Map();

// 确保目录存在
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ 创建目录: ${dirPath}`);
  }
}

// 生成文件名
function generateFileName(url, originalName = '') {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const ext = path.extname(pathname) || '.png';
    const hash = crypto.createHash('md5').update(url).digest('hex').substring(0, 12);
    
    if (originalName && originalName !== 'image') {
      const cleanName = originalName.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_').substring(0, 20);
      return `${cleanName}_${hash}${ext}`;
    }
    
    const pathParts = pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    
    if (lastPart && lastPart !== 'image.png') {
      const baseName = path.basename(lastPart, path.extname(lastPart));
      const cleanBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
      return `${cleanBaseName}_${hash}${ext}`;
    }
    
    return `img_${hash}${ext}`;
  } catch (error) {
    const hash = crypto.createHash('md5').update(url).digest('hex').substring(0, 12);
    return `img_${hash}.png`;
  }
}

// 改进的下载函数，完全模拟浏览器
async function downloadImage(url, fileName) {
  return new Promise((resolve, reject) => {
    const localPath = path.join(CONFIG.imagesDir, fileName);
    
    if (fs.existsSync(localPath)) {
      console.log(`⏭️  图片已存在: ${fileName}`);
      resolve(localPath);
      return;
    }

    const file = fs.createWriteStream(localPath);
    const protocol = url.startsWith('https:') ? https : http;

    console.log(`📥 开始下载: ${url}`);
    
    // 完整的浏览器请求头
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    };

    // 如果是语雀链接，添加特殊的Referer
    if (url.includes('nlark.com') || url.includes('yuque.com')) {
      options.headers['Referer'] = 'https://www.yuque.com/';
      options.headers['Origin'] = 'https://www.yuque.com';
    }
    
    const request = protocol.get(url, options, (response) => {
      // 处理重定向
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(localPath);
        console.log(`🔄 重定向到: ${response.headers.location}`);
        return downloadImage(response.headers.location, fileName)
          .then(resolve)
          .catch(reject);
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(localPath);
        
        let errorMessage = `下载失败，状态码: ${response.statusCode}`;
        switch(response.statusCode) {
          case 403:
            errorMessage += ' - 禁止访问，尝试添加更多请求头信息';
            break;
          case 404:
            errorMessage += ' - 资源不存在';
            break;
          case 429:
            errorMessage += ' - 请求过于频繁，建议增加下载间隔';
            break;
          case 502:
          case 503:
          case 504:
            errorMessage += ' - 服务器错误，可重试';
            break;
        }
        
        reject(new Error(errorMessage));
        return;
      }

      // 处理编码
      let stream = response;
      if (response.headers['content-encoding'] === 'gzip') {
        const zlib = require('zlib');
        stream = response.pipe(zlib.createGunzip());
      } else if (response.headers['content-encoding'] === 'deflate') {
        const zlib = require('zlib');
        stream = response.pipe(zlib.createInflate());
      }

      stream.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`✅ 下载完成: ${fileName}`);
        resolve(localPath);
      });

      file.on('error', (err) => {
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath);
        }
        reject(err);
      });
    });

    request.on('error', (err) => {
      file.close();
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
      reject(err);
    });

    request.setTimeout(CONFIG.timeout, () => {
      request.destroy();
      file.close();
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
      reject(new Error('下载超时'));
    });
  });
}

// 带重试机制的下载
async function downloadImageWithRetry(url, fileName, maxRetries = CONFIG.maxRetries) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await downloadImage(url, fileName);
    } catch (error) {
      console.log(`   ⚠️  第 ${attempt} 次尝试失败: ${error.message}`);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // 递增延迟重试
      const delay = attempt * 2000;
      console.log(`   ⏰ ${delay/1000}秒后重试...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// 延迟函数
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 提取图片URL
function extractImageUrls(content) {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const images = [];
  let match;

  while ((match = imageRegex.exec(content)) !== null) {
    const altText = match[1];
    const url = match[2];
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      images.push({
        fullMatch: match[0],
        altText,
        url,
        originalName: altText || ''
      });
    }
  }

  return images;
}

// 处理单个MDX文件
async function processMdxFile(filePath) {
  console.log(`\n📄 处理文件: ${path.basename(filePath)}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const images = extractImageUrls(content);
    
    if (images.length === 0) {
      console.log(`   ℹ️  未找到网络图片`);
      return;
    }

    console.log(`   🔍 找到 ${images.length} 张网络图片`);
    
    let updatedContent = content;
    let downloadCount = 0;
    let errorCount = 0;

    for (const [index, image] of images.entries()) {
      try {
        // 检查是否已经下载过
        let fileName;
        if (downloadedImages.has(image.url)) {
          fileName = downloadedImages.get(image.url);
          console.log(`   🔗 复用已下载图片: ${fileName}`);
        } else {
          fileName = generateFileName(image.url, image.altText);
          
          // 确保文件名唯一性
          let counter = 1;
          let finalFileName = fileName;
          while (fs.existsSync(path.join(CONFIG.imagesDir, finalFileName))) {
            const ext = path.extname(fileName);
            const nameWithoutExt = path.basename(fileName, ext);
            finalFileName = `${nameWithoutExt}_${counter}${ext}`;
            counter++;
          }
          
          await downloadImageWithRetry(image.url, finalFileName);
          downloadedImages.set(image.url, finalFileName);
          downloadCount++;
          fileName = finalFileName;
          
          // 添加下载间隔
          if (index < images.length - 1) {
            console.log(`   ⏰ 等待 ${CONFIG.downloadDelay}ms...`);
            await delay(CONFIG.downloadDelay);
          }
        }

        // 替换图片路径
        const newImageTag = `![${image.altText}](${CONFIG.baseUrl}/${fileName})`;
        updatedContent = updatedContent.replace(image.fullMatch, newImageTag);
        
      } catch (error) {
        console.error(`   ❌ 下载失败: ${image.url} - ${error.message}`);
        errorCount++;
      }
    }

    // 更新文件
    if (updatedContent !== content) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`   ✅ 文件已更新 (下载: ${downloadCount}, 错误: ${errorCount})`);
    }

  } catch (error) {
    console.error(`   ❌ 处理文件失败: ${error.message}`);
  }
}

// 主函数
async function main() {
  console.log('🚀 开始处理MDX文件中的图片...\n');
  console.log(`⚙️ 配置信息:`);
  console.log(`   - 下载间隔: ${CONFIG.downloadDelay}ms`);
  console.log(`   - 最大重试: ${CONFIG.maxRetries}次`);
  console.log(`   - 超时时间: ${CONFIG.timeout}ms`);
  console.log('');
  
  ensureDirectoryExists(CONFIG.imagesDir);

  if (!fs.existsSync(CONFIG.postsDir)) {
    console.error(`❌ Posts目录不存在: ${CONFIG.postsDir}`);
    return;
  }

  const mdxFiles = fs.readdirSync(CONFIG.postsDir)
    .filter(file => file.endsWith('.mdx'))
    .map(file => path.join(CONFIG.postsDir, file));

  console.log(`📂 找到 ${mdxFiles.length} 个 MDX 文件`);

  for (const filePath of mdxFiles) {
    await processMdxFile(filePath);
    // 文件间也加延迟
    await delay(500);
  }

  console.log('\n🎉 处理完成！');
  console.log(`📊 统计信息:`);
  console.log(`   - 处理文件数: ${mdxFiles.length}`);
  console.log(`   - 下载图片数: ${downloadedImages.size}`);
  console.log(`   - 图片保存目录: ${CONFIG.imagesDir}`);
}

main().catch(console.error);