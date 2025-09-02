// scripts/download-images.js - 单文件版本
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const crypto = require('crypto');

// 配置项
const CONFIG = {
  imagesDir: 'public/images',      // 图片保存目录
  postsDir: 'src/content/posts',   // MDX文件目录
  baseUrl: '/images'               // 图片URL前缀
};

let downloadedImages = new Map(); // 缓存已下载的图片

// 确保目录存在
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ 创建目录: ${dirPath}`);
  }
}

// 从URL生成本地文件名
function generateFileName(url, originalName = '') {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // 提取文件扩展名
    const ext = path.extname(pathname) || '.png';
    
    // 使用URL的完整hash作为文件名，确保唯一性
    const hash = crypto.createHash('md5').update(url).digest('hex').substring(0, 12);
    
    // 如果有原始文件名，结合hash使用
    if (originalName && originalName !== 'image') {
      const cleanName = originalName.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_').substring(0, 20);
      return `${cleanName}_${hash}${ext}`;
    }
    
    // 从URL路径中提取更多信息作为文件名
    const pathParts = pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    
    if (lastPart && lastPart !== 'image.png') {
      const baseName = path.basename(lastPart, path.extname(lastPart));
      const cleanBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
      return `${cleanBaseName}_${hash}${ext}`;
    }
    
    // 默认使用hash作为文件名
    return `img_${hash}${ext}`;
    
  } catch (error) {
    const hash = crypto.createHash('md5').update(url).digest('hex').substring(0, 12);
    return `img_${hash}.png`;
  }
}

// 下载图片
async function downloadImage(url, fileName) {
  return new Promise((resolve, reject) => {
    const localPath = path.join(CONFIG.imagesDir, fileName);
    
    // 如果文件已存在，直接返回
    if (fs.existsSync(localPath)) {
      console.log(`⏭️  图片已存在: ${fileName}`);
      resolve(localPath);
      return;
    }

    const file = fs.createWriteStream(localPath);
    const protocol = url.startsWith('https:') ? https : http;

    console.log(`📥 开始下载: ${url}`);
    
    const request = protocol.get(url, (response) => {
      // 处理重定向
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(localPath);
        return downloadImage(response.headers.location, fileName)
          .then(resolve)
          .catch(reject);
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(localPath);
        reject(new Error(`下载失败，状态码: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`✅ 下载完成: ${fileName}`);
        resolve(localPath);
      });

      file.on('error', (err) => {
        fs.unlinkSync(localPath);
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

    // 设置超时
    request.setTimeout(30000, () => {
      request.destroy();
      file.close();
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
      reject(new Error('下载超时'));
    });
  });
}

// 提取MDX文件中的图片URL
function extractImageUrls(content) {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const images = [];
  let match;

  while ((match = imageRegex.exec(content)) !== null) {
    const altText = match[1];
    const url = match[2];
    
    // 只处理网络图片
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

    for (const image of images) {
      try {
        // 检查是否已经下载过这个URL
        let fileName;
        if (downloadedImages.has(image.url)) {
          fileName = downloadedImages.get(image.url);
          console.log(`   🔗 复用已下载图片: ${fileName}`);
        } else {
          fileName = generateFileName(image.url, image.altText);
          
          // 确保文件名唯一性，避免冲突
          let counter = 1;
          let finalFileName = fileName;
          while (fs.existsSync(path.join(CONFIG.imagesDir, finalFileName))) {
            const ext = path.extname(fileName);
            const nameWithoutExt = path.basename(fileName, ext);
            finalFileName = `${nameWithoutExt}_${counter}${ext}`;
            counter++;
          }
          
          await downloadImage(image.url, finalFileName);
          downloadedImages.set(image.url, finalFileName);
          downloadCount++;
          fileName = finalFileName;
        }

        // 替换图片路径
        const newImageTag = `![${image.altText}](${CONFIG.baseUrl}/${fileName})`;
        updatedContent = updatedContent.replace(image.fullMatch, newImageTag);
        
      } catch (error) {
        console.error(`   ❌ 下载失败: ${image.url} - ${error.message}`);
        errorCount++;
      }
    }

    // 如果有更新，写回文件
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
  
  // 确保图片目录存在
  ensureDirectoryExists(CONFIG.imagesDir);

  // 检查posts目录是否存在
  if (!fs.existsSync(CONFIG.postsDir)) {
    console.error(`❌ Posts目录不存在: ${CONFIG.postsDir}`);
    return;
  }

  // 获取所有MDX文件
  const mdxFiles = fs.readdirSync(CONFIG.postsDir)
    .filter(file => file.endsWith('.mdx'))
    .map(file => path.join(CONFIG.postsDir, file));

  console.log(`📂 找到 ${mdxFiles.length} 个 MDX 文件`);

  // 处理每个文件
  for (const filePath of mdxFiles) {
    await processMdxFile(filePath);
    // 添加小延迟，避免过于频繁的请求
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n🎉 处理完成！');
  console.log(`📊 统计信息:`);
  console.log(`   - 处理文件数: ${mdxFiles.length}`);
  console.log(`   - 下载图片数: ${downloadedImages.size}`);
  console.log(`   - 图片保存目录: ${CONFIG.imagesDir}`);
  
  // 显示下载报告
  if (downloadedImages.size > 0) {
    console.log('\n📋 下载报告:');
    downloadedImages.forEach((fileName, url) => {
      console.log(`   ${fileName} <- ${url.substring(0, 60)}...`);
    });
  }
}

main().catch(console.error);