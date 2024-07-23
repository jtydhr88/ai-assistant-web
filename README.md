# AI Assistant Web

AI Assistant Web is a new UI written by React for [tori29umai](https://x.com/tori29umai)'s AI Assistant, with some new features.
![img.png](/docs/img.png)
## How to run it

### Method1
Run by nodejs directly.
1. install node
2. git clone this repo
3. npm install
4. npm start
5. run AI Assistant with parameters 
```commandline
--cors-allow-origins "http://127.0.0.1:7860,http://localhost:3000"
```
6. open localhost:8080

### Method2
Run within AI Assistant.
1. use [my branch](https://github.com/jtydhr88/AI-Assistant/tree/new-web-by-react) for AI Assistant.
2. run AI Assistant with parameters 
```commandline
--cors-allow-origins "http://127.0.0.1:7860,http://localhost:3000"
```
3. access to http://127.0.0.1:7860/file=index.html

(This is a temp approach, due to gradio limitation, it could not be refreshed browser manually.)

## Some feature introductions for the new AI Assistant UI
1. Full implementation of the existing AI Assistant functions.
2. A more intuitive way to select the light source position in the lighting tag.![/docs/img_1.png](/docs/img_1.png)
3. For some functions using sliders, images can be generated directly without clicking a button.
4. Added functionality to extract transparent line art.![img_2.png](/docs/img_2.png)
5. Added functionality to extract positive and negative shapes based on lighting images.![img_3.png](/docs/img_3.png)

## useful tool tags I plan to add (TODO):
1. Object removal from images.
2. Background removal from images.

## The reason I do this
The reason for this is that when I was developing several plugins for SD-webui last year, I found that although Gradio can quickly build an AI application, it has significant limitations in terms of UI. While it is possible to use some technical means to make Gradio support more complex UIs (for example, when implementing [sd-webui-3d-editor](https://github.com/jtydhr88/sd-webui-3d-editor), I integrated the complete Three.js editor, or integrated React programs in other plugins, such as [sd-canvas-editor](https://github.com/jtydhr88/sd-canvas-editor), from my personal experience, there is no need to use Gradio for an independent program (with SD-webui as the backend).

Using React directly, as an industry standard, along with other related libraries, makes front-end development easier, more controllable, and aesthetically pleasing. It can also easily achieve some functions that would require very complex steps in Gradio or are simply not achievable.

Meanwhile, since this new UI is an independent front-end application, it means it can use other programs as backend engines. Therefore, after completing the above functions, I will start working on an AI Assistant based on ComfyUI as the backend, using this UI as the front end.

As an amateur painting enthusiast, I have been switching between "coding" and "drawing" every day recently while developing this program. I want to understand the needs of artists from the perspective of a painting enthusiast, and this understanding can only be felt by picking up a pen and drawing myself.

Lastly, thanks to [tori29umai](https://x.com/tori29umai) for creating such a fantastic program!

## Credit & Thanks
1. original implement by [tori29umai](https://x.com/tori29umai)


