import * as shell from 'shelljs';

// Copy all the view templates
shell.cp('-R', 'src/assets', 'dist');
shell.rm('-rf', 'dist/assets/*.js');
shell.rm('-rf', 'dist/assets/*.ts');
