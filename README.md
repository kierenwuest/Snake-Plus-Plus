# Snake++
by Kieren Wuest.

Play here: https://kierenwuest.github.io/Snake-plus-plus/

💀 Bugs I'm trying to work out 💀: 

Sometimes(rare/intermittent) the snake will crash into its own direction even though I tried to prevent this from happening. Control code for fast changes within the 10th sec interval will not prevent a self impact.

Sometimes(rare/intermittent) coloured dots will randomly appear in info table. Not sure why, gussing a script order issue.

🎯 Roadmap 🎯: 

IN PROGRESS: Teleport walls, instead of solid.

IN PROGRESS: Create random obstacles in white shape outline (mayble like tetris blocks). Don't allow dots to spawn in them.

Create some fancy css particle effects, make styling more retro arcade.

Implement better more sopisticated sound behavior, JS audio context is complicated.

Project some light x y lines coming from dots.

Some kind of gameplay tweak pre-collision for high speed play.

Create bigger dots basedon the random 1-5 score.

Create mobile touch controls and responsive resizing.

Some kind of celebration at score 100, confetti and sound effcts or something.

Add windows gamepad support.

Create some movement/shudder for the snake head to give it character.

Create Bad Guy computer snake with primative AI movements.

Create Game Over bouns multiplier score sequence.

✔️ Done ++ ✔️:

Create dynamic wider grid for desktop.

Make movement speed smoother, more accurate literal speed.

Make grid 10x10 pixels.

Add a visual gird.

Add new snake food (Dots).

Add speed level and separate random score range.

Make score taillength.

Add sound effects for eating dots.

Add info panel as canvas alongside.

Add snake coords.

Add collected dots to info panel.

Add gane info, bugs and features to html and style fonts.

Add score level and speed to different dots.

BUG: When I tired to implement wildcard dot feature, somehow the first dot triggers all dots on the first red dot colision. This was due to implmenting the initialiasation of the random co-ord as a variable.

Some kind of final special wild card Dot,that cycles colours, and that reduces speed or does something special or random.

BUG: Sometimes(rare/intermittent) the coloured dots spawn out of bounds(or not at all), when I've tried to constrain them in the play area.

Create a highscore element.

Made some styling more retro arcade.

Pop display the random dot value on collision.

Fade display the random dot value on collision.

Create Start Game intro screen with graphic and music.

Review and refactor code.
