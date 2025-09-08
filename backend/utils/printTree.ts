// C:\Users\Gjpro\Desktop\bin-tracking-widget\backend\utils\printTree.ts

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Define TreeNode interface
interface TreeNode {
  [key: string]: TreeNode | 'file';
}

// Directories to exclude
const excludeDirs = ['dist', 'node_modules', '.git', 'build', '.next', 'coverage'];

// Function to gather directory structure recursively (no depth limit)
const getDirectoryStructure = (dirPath: string): TreeNode => {
  const structure: TreeNode = {};
  
  try {
    const files = fs.readdirSync(dirPath);
    
    files.forEach((file) => {
      // Skip excluded directories
      if (excludeDirs.includes(file)) return;
      
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        structure[file] = getDirectoryStructure(filePath);
      } else {
        structure[file] = 'file';
      }
    });
  } catch (error) {
    // Silent error handling
  }

  return structure;
};

// Get paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get backend and frontend directories
// From utils folder, go up to backend, then up to project root
const backendDir = path.resolve(__dirname, '..'); // Go up one level to backend
const projectRoot = path.resolve(__dirname, '../..'); // Go up two levels to project root
const frontendDir = path.join(projectRoot, 'frontend');

// Debug: Check if directories exist
if (!fs.existsSync(backendDir)) {
  console.log(`Backend dir not found at: ${backendDir}`);
}
if (!fs.existsSync(frontendDir)) {
  console.log(`Frontend dir not found at: ${frontendDir}`);
}

// Build the complete structure
const completeStructure = {
  backend: getDirectoryStructure(backendDir),
  frontend: fs.existsSync(frontendDir) ? getDirectoryStructure(frontendDir) : { "error": "frontend directory not found" }
};

// Save to JSON file in utils directory
const jsonFilePath = path.join(__dirname, 'binTrackingStructure.json');
fs.writeFileSync(jsonFilePath, JSON.stringify(completeStructure, null, 2), 'utf-8');

// cd C:\Users\Gjpro\Desktop\bin-tracking-widget\backend
// npx tsx utils/printTree.ts

