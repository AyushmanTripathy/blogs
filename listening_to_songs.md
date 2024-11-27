# Listening to songs, like chads

I use Arch Btw.

For context, I have this ancient laptop, and I love listening to random songs on YouTube while coding. However, my computer tends to get pretty toasty, hitting around 70°C, especially if I try to have YouTube open while doing something else. So, I’ve decided to do some shell scripting.

## The Script

First of all, I got all YouTube video IDs from the playlist I listen to. (it has 1161 songs)

```sh
yt-dlp --flat-playlist --print id "<playlist url here>" > ids.txt
```
the playlist URL I used, https://youtu.be/kJQP7kiw5Fk?list=PL15B1E77BB5708555. you can use your favorite.

now I wrote a very simple shell script to download the songs (using yt-dlp) and play them (using mpv). you can choose a different media player. make sure to check out yt-dlp if you haven’t already.

```sh
#!/bin/sh

if [ ! -f "./current_id.txt" ]; then
  echo "1" > ./current_id.txt
  mkdir playing played
fi

while true
do
  current_id=$(cat ./current_id.txt)
  expr "$current_id" "+" 1 > ./current_id.txt
  song_id=$(head "-$current_id" < ids.txt | tail -1)
  echo "$song_id"
  yt-dlp -f wa "$song_id" -o "./playing/%(title)s.%(ext)s" 
  mpv playing/*
  mv playing/* played/
done
```

after saving the script in a file, run it

```sh
sh script.sh
```

## Explanation

We are keeping track of the last video played using the current_id.txt file, we increment it every time by one using expr command. head and tail commands are to get the nth line from the ids.txt file

the -f wa option for yt-dlp selects the worst quality audio-only format (because I have shitty internet).

yt-dlp downloads the song in the playing directory, after mpv plays the song, it is moved to the played directory.

## Conclusion

Shell scripting is the best skill I have learned, and would highly encourage you to give it a try, it's seriously awesome.

also here is my [github](https://github.com/AyushmanTripathy).

I later upgraded the script to do things like handle multiple playlists, caching of downloaded songs, and much more, you can find it [here](https://github.com/ayushmantripathy/bin/blob/master/ytp).

Liked the script, check out [my local bin](https://github.com/AyushmanTripathy/bin).
