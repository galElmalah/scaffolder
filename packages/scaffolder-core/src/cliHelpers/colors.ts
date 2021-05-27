import { bold as _bold, red, yellow, blue, green, white } from 'kleur';

export const error = red().bold;
export const warning = yellow;
export const boldGreen = green().bold;
export const path = blue().underline().bold;
export const bold = _bold;
export const success = green().bold().underline;
export const metaText = white().dim;