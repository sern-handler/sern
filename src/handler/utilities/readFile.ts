import { ApplicationCommandType, ComponentType, InteractionType, MessageComponentInteraction, MessageComponentType } from 'discord.js';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { from, Observable } from 'rxjs';
import { CommandType } from '../sern';
import type { PluggedModule } from '../structures/modules/module';


// A little ambigious, but ChatInput map stores text commands also. 
export const ApplicationCommandStore = {
    [ApplicationCommandType.User] : new Map<string, PluggedModule>(),
    [ApplicationCommandType.Message] : new Map<string, PluggedModule>(),
    [ApplicationCommandType.ChatInput] : new Map<string, PluggedModule>(), 
} as {[K in ApplicationCommandType] : Map<string, PluggedModule> }

export const MessageCompCommandStore = {
    [ComponentType.Button] : new Map<string, PluggedModule>(),
    [ComponentType.SelectMenu] : new Map<string, PluggedModule>()
}
export const TextCommandStore = {
    [CommandType.Text] : new Map<string, PluggedModule>() // Aliases 
}
export const Alias = new Map<string, PluggedModule>();

// Courtesy @Townsy45
function readPath(dir: string, arrayOfFiles: string[] = []): string[] {
  try {
    const files = readdirSync(dir);
    for (const file of files) {
      if (statSync(dir + '/' + file).isDirectory()) readPath(dir + '/' + file, arrayOfFiles);
      else arrayOfFiles.push(join(dir, '/', file));
    }
  } catch (err) {
    throw err;
  }

  return arrayOfFiles;
}

export const fmtFileName = (n: string) => n.substring(0, n.length - 3);

/**
 * 
 * @param {commandsDir} Relative path to commands directory
 * @returns {Promise<{ mod: PluggedModule; absPath: string; }[]>} data from command files
 */

export function buildData(commandDir: string ): Observable<
  {
    plugged: PluggedModule;
    absPath: string;
  }> {
  return from(getCommands(commandDir).map(absPath => { 
       const plugged = (<PluggedModule> require(absPath).module);
       return { plugged, absPath }
  }))
}

export function getCommands(dir: string): string[] {
  return readPath(join(process.cwd(), dir));
}
