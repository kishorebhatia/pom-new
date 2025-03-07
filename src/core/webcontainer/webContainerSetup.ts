import { WebContainer } from '@webcontainer/api';
import { FileSystemTree } from '@webcontainer/api';

/**
 * Sets up a WebContainer with the provided files
 * @param files The file system tree to mount
 * @returns The WebContainer instance and iframe
 */
export async function setupWebContainer(files: FileSystemTree) {
  try {
    // Initialize the WebContainer
    const webContainer = await WebContainer.boot();
    
    // Mount the file system
    await webContainer.mount(files);
    
    // Install dependencies
    const installProcess = await webContainer.spawn('npm', ['install']);
    
    // Wait for the installation to complete
    const installExitCode = await installProcess.exit;
    
    if (installExitCode !== 0) {
      throw new Error('Failed to install dependencies');
    }
    
    // Start the development server
    await webContainer.spawn('npm', ['run', 'dev']);
    
    // Get a reference to the iframe
    const iframe = document.querySelector('iframe') as HTMLIFrameElement;
    
    // Wait for the server to be ready
    webContainer.on('server-ready', (port, url) => {
      if (iframe) {
        iframe.src = url;
      }
    });
    
    return { webContainer, iframe };
  } catch (error) {
    console.error('Error setting up WebContainer:', error);
    throw error;
  }
}

/**
 * Executes a command in the WebContainer
 * @param webContainer The WebContainer instance
 * @param command The command to execute
 * @param args The command arguments
 * @returns The exit code of the process
 */
export async function executeCommand(
  webContainer: WebContainer,
  command: string,
  args: string[] = []
): Promise<number> {
  try {
    const process = await webContainer.spawn(command, args);
    return await process.exit;
  } catch (error) {
    console.error(`Error executing command ${command}:`, error);
    throw error;
  }
}

/**
 * Reads a file from the WebContainer file system
 * @param webContainer The WebContainer instance
 * @param path The file path
 * @returns The file content
 */
export async function readFile(
  webContainer: WebContainer,
  path: string
): Promise<string> {
  try {
    const file = await webContainer.fs.readFile(path, 'utf-8');
    return file;
  } catch (error) {
    console.error(`Error reading file ${path}:`, error);
    throw error;
  }
}

/**
 * Writes a file to the WebContainer file system
 * @param webContainer The WebContainer instance
 * @param path The file path
 * @param content The file content
 */
export async function writeFile(
  webContainer: WebContainer,
  path: string,
  content: string
): Promise<void> {
  try {
    await webContainer.fs.writeFile(path, content);
  } catch (error) {
    console.error(`Error writing file ${path}:`, error);
    throw error;
  }
} 