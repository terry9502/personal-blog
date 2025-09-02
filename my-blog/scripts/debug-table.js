// scripts/debug-table.js - 表格渲染调试脚本
const fs = require('fs');
const path = require('path');

// 检查文件内容和配置
function debugTableRendering() {
  console.log('🔍 开始诊断表格渲染问题...\n');

  // 1. 检查 AchieveMail.mdx 文件
  const achieveMailPath = path.join('src/content/posts', 'AchieveMail.mdx');
  
  if (!fs.existsSync(achieveMailPath)) {
    console.error('❌ AchieveMail.mdx 文件不存在');
    return;
  }

  console.log('📄 读取 AchieveMail.mdx 文件...');
  const content = fs.readFileSync(achieveMailPath, 'utf8');
  
  // 查找表格
  const tableMatches = content.match(/\|[^]*?\|/g);
  
  if (!tableMatches) {
    console.log('❌ 未找到表格内容');
    return;
  }

  console.log(`✅ 找到 ${tableMatches.length} 个可能的表格\n`);

  // 分析每个表格
  tableMatches.forEach((table, index) => {
    console.log(`📊 表格 ${index + 1}:`);
    console.log('原始内容:');
    console.log(table);
    console.log('\n分析:');
    
    const lines = table.split('\n').filter(line => line.trim().includes('|'));
    console.log(`- 行数: ${lines.length}`);
    
    lines.forEach((line, lineIndex) => {
      const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
      console.log(`  行 ${lineIndex + 1}: ${cells.length} 列 - [${cells.join(', ')}]`);
    });
    
    console.log('---\n');
  });

  // 2. 检查 next.config.ts
  const nextConfigPath = 'next.config.ts';
  if (fs.existsSync(nextConfigPath)) {
    console.log('📋 检查 next.config.ts...');
    const configContent = fs.readFileSync(nextConfigPath, 'utf8');
    
    if (configContent.includes('remarkGfm')) {
      console.log('✅ remark-gfm 已配置');
    } else {
      console.log('❌ remark-gfm 未配置');
    }
  }

  // 3. 检查 package.json
  const packageJsonPath = 'package.json';
  if (fs.existsSync(packageJsonPath)) {
    console.log('📦 检查依赖包...');
    const packageContent = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const requiredPackages = ['remark-gfm', '@tailwindcss/typography'];
    requiredPackages.forEach(pkg => {
      if (packageContent.dependencies?.[pkg] || packageContent.devDependencies?.[pkg]) {
        console.log(`✅ ${pkg} 已安装`);
      } else {
        console.log(`❌ ${pkg} 未安装`);
      }
    });
  }

  // 4. 生成测试表格
  console.log('\n🧪 生成测试表格文件...');
  const testTable = `---
title: '表格测试'
date: '2024-12-20'
description: '测试表格渲染是否正常'
tags: ['测试']
---

# 表格测试

## 简单表格

| 列1 | 列2 | 列3 |
| --- | --- | --- |
| 数据1 | 数据2 | 数据3 |
| 数据4 | 数据5 | 数据6 |

## 邮件系统需求表

| 功能模块 | 需求描述 | 详细说明 | 备注 |
| --- | --- | --- | --- |
| 主界面 | 邮件列表界面 | 列表中包含标题，发件人，收件信息 | |
| 邮件详情界面 | 查询邮件详情 | 点击列表中的邮件标题则在新页面中显示邮件完整信息 | 包含：标题、发件人、收件日期及邮件内容 |
| 删除功能 | 实现邮件的删除 | 点击邮件列表中的"删除"按钮将删除当前邮件 | |

## 数据库表设计

| 字段 | 类型 | 特征 | 说明 |
| --- | --- | --- | --- |
| Mail_id | Int(4) | PK、自增 | 主键 |
| Title | Varchar(50) | Not null | 邮件标题 |
| Recive_date | Date | | 收件日期 |
| Sender | Varchar(20) | | 发件人 |
| Content | Varchar(200) | | 邮件内容 |
`;

  const testFilePath = path.join('src/content/posts', 'table-test.mdx');
  fs.writeFileSync(testFilePath, testTable, 'utf8');
  console.log(`✅ 测试文件已创建: ${testFilePath}`);
  
  console.log('\n🔧 建议的调试步骤:');
  console.log('1. 访问 /blog/table-test 查看测试表格是否正常显示');
  console.log('2. 如果测试表格正常，说明配置没问题，只需修复 AchieveMail.mdx');
  console.log('3. 如果测试表格也异常，说明需要检查 MDX 配置');
  console.log('4. 检查浏览器开发者工具的 Console 是否有错误信息');
  console.log('5. 检查浏览器开发者工具的 Network 面板，看 CSS 是否正确加载');
}

debugTableRendering();