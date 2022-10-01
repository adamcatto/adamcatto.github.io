# Projects

Here is a list of projects that I've worked on, am currently working on, or am interested in pursuing in the future (or that I haven't seen anybody work on and would at least like to see somebody work on):

## Research



## Non-Research

### AI

1. A computer vision system that finds intriguing patterns in splattered paint and describes / categorizes them, ideally in a "personalized" way.

This is a sort of project that artists might do when looking for a figure to draw/paint. Take some irregularly-patterned object, such as a plastic wrapper, dip it into some black paint, and start randomly dabbing it onto a blank piece of white paper. Then scan it for intriguing figures that appear -- if you are slightly imaginative (hint: you absolutely are), there will be many such patterns. Draw a box (or tight boundary) around whatever you find and give it a description. It can be as simple as "face", "person", "chair", "seal", etc., or as complicated as "Gru from Despicable Me scolding a minion".

From a computer vision point-of-view, the idea here is that you generate a whole lot of these images, then use some open-source image annotation tool to annotate them at varying levels of description - you can draw bounding boxes or segmentation masks, or perhaps even a multi-level segmentation mask, where you first draw the boundary of the figure, and inside the boundary you draw a pixel-wise segmentation (i.e. if it's a face, give a description/categorization of each pixel, this pixel is part of the nose, this pixel contributes to the smile, etc.). For each of these objects you've annotated, give both a category and a textual description. Once enough of these are given, you can train an autoencoder that spits out an instance segmentation or labeled bounding boxes, or perhaps beyond that to actual text descriptions of the segmented objects!

Take this one step further and build an online tool that allows people to create profiles and store their individual annotations. If persons X and Y create enough annotations themselves, you can build personalized networks to imitate their descriptions!

2. 
