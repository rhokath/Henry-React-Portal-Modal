# React Modal - with Portals!

<img src="https://i.imgur.com/Q6oZSEW.gif" />

Let's make a modal, that works anywhere. Commonly, we want modals, toasts, or other elements that position themselves absolutely in the browser. But, we need to be careful where we render these elements or they will end up being positioned relative to the wrong element, or get caught by an `overflow: hidden`.

Instead of worrying about that, React gives us a fantastic tool called [Portals](https://reactjs.org/docs/portals.html). This allows us to render our components anywhere in the DOM tree that we want!

```js
const SomeComponent = () => {
  return (
  <div style={{ position: 'relative', overflow: 'hidden', width: '20px', height: '20px' }}>
    Some other content
    <Modal>
      This will still fill up the screen, despite its 'parent' having css properties that would normally cause problems. 
    </Modal>
  </div>
  )
};
```

This involves some amount of DOM manipulation, which is a good thing! We can't forget that React exists in our web browser, our vanilla DOM and JS knowledge is still valuable, and React cannot abstract *everything* away.

## Goals

* [ ] Create a style a Modal component (which can be surprisingly difficult)
* [ ] Conditionally render the Modal based on some state (i.e. on button press)
* [ ] Put the Modal in a container that ruins its positioning with `position: relative`, `overflow: hidden`, etc.
* [ ] Escape the container in the DOM using a [Portal](https://reactjs.org/docs/portals.html) in the Modal component
  * [ ] Hardcode a portal root in `index.html`
  * [ ] Create a `div`, once per component, to use a portal target
  * [ ] Write a `useEffect` that correctly adds the portal target to the portal root on mount, and removes it on unmount
* [ ] Make clicking outside the Modal dismiss it (a huge pet peeve of mine)
* [ ] Prevent the page body from scrolling while the portal is open, while preserving scroll position. If you don't know how to do this, google it. That's why I put it here.

## Stretch Goals

* [ ] Write a `usePortal` hook
* [ ] Understand what this comment means in the React documentation
  ```
  // The portal element is inserted in the DOM tree after
  // the Modal's children are mounted, meaning that children
  // will be mounted on a detached DOM node. If a child
  // component requires to be attached to the DOM tree
  // immediately when mounted, for example to measure a
  // DOM node, or uses 'autoFocus' in a descendant, add
  // state to Modal and only render the children when Modal
  // is inserted in the DOM tree.
  ```
* [ ] Use a dynamic portal root, instead of hardcoding one into `index.html`. You can do this many ways, including a smart `useEffect`, a context provider, etc.
* [ ] Close the modal when 'Escape' is pressed, regardless of what the keyboard is focusing.
* [ ] Create a Toast component, and a dispatch function to add new toasts.

## Notes

* This trickery is necessary because of [the stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context) and [relative positioning](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Positioning).
* The React Tree is **NOT** the DOM Tree. For example, Events will still propagate 'normally' through the React tree even if the resulting elements end up differently in the rendered DOM tree.
