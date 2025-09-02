// scripts/fix-tables.js - 修复MDX文件中的表格格式
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  postsDir: 'src/content/posts',   // MDX文件目录
};

// 修复表格格式的函数
function fixTableFormat(content) {
  // 正则表达式匹配破损的表格
  const brokenTableRegex = /\|\s*([^|]+)\s*\|\s*---\s*\|([^]*?)(?=\n\n|\n#|\n\*\*|$)/g;
  
  let fixedContent = content;
  let match;
  
  while ((match = brokenTableRegex.exec(content)) !== null) {
    const brokenTable = match[0];
    console.log('发现破损表格:', brokenTable.substring(0, 100) + '...');
    
    // 尝试重构表格
    const lines = brokenTable.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) continue;
    
    // 分析表格结构
    const tableLines = [];
    let currentRow = [];
    
    for (const line of lines) {
      const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
      
      if (cells.length > 0) {
        // 如果是分隔符行，跳过
        if (cells.every(cell => cell.match(/^-+$/))) {
          continue;
        }
        
        currentRow.push(...cells);
        
        // 判断是否为完整行（简单启发式：如果包含常见的结束词）
        const lastCell = currentRow[currentRow.length - 1];
        if (lastCell && (lastCell.includes('。') || lastCell.includes('.') || lastCell.length > 20)) {
          tableLines.push([...currentRow]);
          currentRow = [];
        }
      }
    }
    
    // 添加剩余的行
    if (currentRow.length > 0) {
      tableLines.push(currentRow);
    }
    
    if (tableLines.length > 0) {
      // 确定列数（取最大列数）
      const maxCols = Math.max(...tableLines.map(row => row.length));
      
      // 补齐列数
      const normalizedRows = tableLines.map(row => {
        while (row.length < maxCols) {
          row.push('');
        }
        return row;
      });
      
      // 生成标准的Markdown表格
      const headers = normalizedRows[0];
      const separator = Array(maxCols).fill('---');
      const dataRows = normalizedRows.slice(1);
      
      const fixedTable = [
        '| ' + headers.join(' | ') + ' |',
        '| ' + separator.join(' | ') + ' |',
        ...dataRows.map(row => '| ' + row.join(' | ') + ' |')
      ].join('\n');
      
      fixedContent = fixedContent.replace(brokenTable, fixedTable);
      console.log('✅ 表格已修复');
    }
  }
  
  return fixedContent;
}

// 处理单个MDX文件
function processMdxFile(filePath) {
  console.log(`\n📄 检查文件: ${path.basename(filePath)}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = fixTableFormat(content);
    
    if (fixedContent !== content) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`   ✅ 表格已修复并保存`);
    } else {
      console.log(`   ℹ️  未发现需要修复的表格`);
    }
    
  } catch (error) {
    console.error(`   ❌ 处理文件失败: ${error.message}`);
  }
}

// 主函数
function main() {
  console.log('🔧 开始修复MDX文件中的表格格式...\n');
  
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
    processMdxFile(filePath);
  }

  console.log('\n🎉 表格修复完成！');
}

main();