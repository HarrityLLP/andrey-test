# andrey-test

## Introduction

Thank you for your interest in building innovative, enterprise-class patent tools for Harrity & Harrity, LLP.

## Objective

Your task, should you choose to accept it, is to build a document search engine for patent documents.

Your solution should be a full-stack web application for patent document searching that searches patent application data and displays the results with keyword highlighting.

## Requirements:

- Single page web application

- Use MongoDB to store the patent documents

- Use NodeJS and npm modules to create the back-end components

- Use JavaScript and any libraries you are comfortable with for the front-end.

## Functionality
### Main Search

  - A search interface where the user can enter keywords.  For example, a user could search for: ultra capacitor

### Results

- lists the matching document filenames
- displays thumbnail of the first image
- displays a snippet of text displaying the keywords in context (KWIC) of the text in which they appear.  (The snippet does not need to contain every example of the keyword.)

For example the search for ultra capacitor would display:
<p align="center">
  <img src="https://github.com/HarrityLLP/andrey-test/blob/master/2-results.PNG" width="50%">
</p>

### Document Display
- Each keyword should be highlighted with a different color.
- A keyword highlighting box at the top of this page to adjust the keywords that should be highlighted.
- Changing the keywords in the keyword highlighting box should not restart the search, but rather just change what text is highlighted.
- A text area that displays the text of the entire document and highlight every instance of the matching keywords.
- An image area that displays the images of the patent
- Ability to navigate back to the result list.

For example
<p align="center">
  <img src="https://github.com/HarrityLLP/andrey-test/blob/master/3-DocumentView.PNG" width="50%">
</p>

The example images above are merely one way that the interface could look.  Feel free to design it differently.

## What is in this Repo

The Data folder in this repo has the sample data.

### Patent Document Text

Each patent document is represented by a text file.  This should be the basis for the search function.

### Patent Document Images

The png files correspond to the patent document text files.  They are correlated by the initial document number.  

For example:
- US07249732-20070731-D00015.png is an image attached to
- US07249732 - Aerodynamically stable, VTOL aircraft.txt


Please clone this repository, create a branch for your code, develop your answer the using the tools of your choice, push your changes back to GitHub, and create a Pull Request to merge your changes into the master branch.  

## Timeline

Your test answer will be timely if the pull request with all of your commits is created in GitHub **before** Wednesday, March 13 at 2:00 pm (US Eastern Time).

**Good luck!**
