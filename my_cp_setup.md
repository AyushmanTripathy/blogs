# My CP Setup

Of course i wrote some shell script to automate stuff, lets check them out, shall we?

## Running Tests

you can find the script in my [bin](https://github.com/AyushmanTripathy/bin/blob/master/runtests). download the script and place it in your local bin.

```sh
# to add a test case
runtests -a
# paste your input and enter a empty line
# paste your expected output and enter a empty line
```

You can add multiple test cases this way. then to run you code against it,

```sh
runtests <your file>
```

It currently supports py, cpp and js extensions. In case any of the test case fails, it will print your output and expected output side by side, like this

```sh
CASE #1 [ failed ]
3                      2
```

It handles infinite loops by giving a TLE and incase all the test cases pass, congrats 🥳. and by the way

```sh
# to remove all the test cases
runtests -c
# to view test cases
runtests -v
```

## How it works?

let me explain how it works. It creates a directory structure like the following to store test cases,

```sh
.
├── 1
│   ├── input.txt
│   └── output.txt
└── counter
```

This counter file stores the number of test cases. each test case (denoted by a number) is stored as a directory with 2 files, input (in input.txt) and expected output (in output.txt). code for reading these files is as follows,

```sh
# $1 is name of the file to write to 
read_input() {
  rm -f $1
  while read line
  do
    # break if the line is empty
    [ -z "$line" ] && break
    # sed is used to trim spaces
    echo "$line" | sed -e 's/^\s*//g' -e 's/\s*$//g' >> "$1"
  done
}
```

To compare files it uses the diff command. to print text side by side pr command is used. like for example for.py extensions

```sh
# $1 is code file name
# $2 is base directory
# $3 is test case number
run_py_test_case() {
  green "CASE #$3 "

  cat "$2/input.txt" | timeout 3s python3 "$1" > "$base_loc/out" || error "runtime error"
  if diff "$base_loc/out" "$2/output.txt" -white > /dev/null; then
    green "[ passed ]\n"
  else
    red "[ failed ]\n"
    pr -m -t "$base_loc/out" "$2/output.txt"
    printf "\n"
  fi

  rm "$base_loc/out"
}
```

Notice the timeout 3s it is used to terminate execution if the script takes more than 3s (in case of infinite loops). In that case, we get a TLE.

script has a similar function for js and cpp files. based on the extension of the code file, any one of these is called.

