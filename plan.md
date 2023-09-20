# REM - Render Markdown

REM is a markdown renderer, markdown doesn't look that good, but in github markdown looks super good and elegant, so this is an approach to provide a good and elegant look for the markdown files.

## Process

There will be a html template, and a markdown parser, that will parse the input markdown and generate a html file, which we will be then loaded and rendered on screen.

A css file will be created for styling all the different markdown tags.

## Technologies

Vanilla JS + NodeJS will be used for parser, and then pug will be used as template engine or the html will be directly sent as an http response.

## Parser

So read each line in a file, check for any symbols that matches with that of used in markdown if yes then send it to a subroutine where it will be inserted in html.

## Markdown Syntax

### Heading

- #, h1
- ##, h2
- ###, h3
- ####, h4
- #####, h5
- ######, h6

- =====, h1
- -----, h2

### Paragraphs

- Line Breaks

### Bold

- **Bold**
- **BOLD**

### Italics

- _BOLD_
- _BOLD_

### Bold And Italics

- **_BOLD_**
- **_BOLD_**

### Blockquotes

- > Blockquote

### Ordered List

1. List Item 1
2. List Item 2

### Unordered List

- List Item 1
- List Item 2

### Images

- ![Image](http://image.com)

### Code

- `markdown`

- ```c
    function add(){}
  ```

### Horizontal Lines

- ***

### Links

- [Link](http://link.com)

### Plan for site

- User can upload a file or can paste the markdown directly

#### Cases

- `Hello`
- Hello `World`
- `Hello` `World`
- `Hello World`
- `Hello World.`
