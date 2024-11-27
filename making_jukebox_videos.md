<!--- shellscripting, linux, automation -->

# Making Jukebox videos, Automated.

Meet two good friends of mine, FFmpeg & Shellscripting.

I was procrastinating studying a day before my end sems, as one usually does and I came across a few jukebox videos, and noticed the views count 🤯. Let's make some then, without manual labor of course.

What do we need? a few songs and a background image.

## Creating the song compilation

Let's assume you have all your songs in a directory called songs, we want to have all the song names in a .txt file, so

```sh
for i in songs/*
do
  echo $i >> songs.txt
done
```

why not a ``ls > songs.txt``🤔, because that puts "songs.txt" itself in songs.txt.

Now we can edit this song.txt file to define the order of the songs, FFmpeg requires the file names to be listed in specific ways

```sh
for i in $(cat songs.txt)
do
  echo "file $i" >> sequence.txt
done
ffmpeg -f concat -i sequence.txt audio.mp4
rm sequence.txt
```

Now we have the compilation in audio.mp4. You may be wondering why I wrote to a separate .txt file, because it will be helpful when generating the timestamps.

## Creating the background video

we need to convert the image to a .mp4 video of the same duration. First let us get the duration in seconds,

```sh
duration=$(ffprobe -i audio.mp4 -show_entries format=duration -v quiet -of csv="p=0")
```

These durations can be long, like hours long. encoding that video that long may cause my CPU to commit suicide. So let's make some jugaad.

What we can do instead is make a 10s video of the still image and concat it with itself many times to get a longer video, how many times?

```sh
count=$(echo "console.log(Math.ceil(Math.log10($duration)) - 1)" | node)
```

make the first 10s video. I have taken 1920x1080 resolution.

```sh
ffmpeg -loop 1 -i background.jpg -t 10 -pix_fmt yuv420p -vf scale=1080:1920 clip.mp4
```

each time we increase the video’s length by ten times,

```sh
# required format for FFmpeg.
echo "file clip.mp4" > clips.txt
for i in $(seq 9)
do
  echo "file clip.mp4" >> clips.txt
done

# video concat
for i in $(seq $count)
do
  ffmpeg -f concat -i clips.txt -c copy tmp.mp4
  mv tmp.mp4 clip.mp4
done
```

Finally, let's put the video and audio together.

```sh
ffmpeg -i clip.mp4 -i audio.mp4 -map 0:v -map 1:a -c copy -shortest final.mp4
```

## Writing Timestamps

We also need to divide the video into chapters for YouTube. we need a format like this,

```sh
00:00:00 baller
00:02:33 you and me
00:05:23 her
00:07:57 elevated
00:11:18 we rollin
00:14:37 still rollin
00:17:28 king shit
```

It can be achieved by using the songs.txt file we created earlier and some sed editing to remove file extensions and ‘_’s

```sh

time="0"
for i in $(cat songs.txt) 
do
  echo "$(date -d@$time -u +%H:%M:%S) $i" | sed -e "s/_/ /g" -e "s/\..*$//" >> timestamps.txt
  duration=$(ffprobe -i $i -show_entries format=duration -v quiet -of csv="p=0" | sed -e 's/\..*$//')
  time=$(expr $duration \+ $time)
done
```

Here you go, all done.

Upload the video to YouTube, copy and paste the timestamps into the description, and hopefully you will be famous in no time.

The entire script can be found in [my local bin](https://github.com/AyushmanTripathy/bin/blob/master/make-jukebox). An example youtube video I made is [here](https://youtu.be/LJz52o5rlW0).

Have a nice day!
