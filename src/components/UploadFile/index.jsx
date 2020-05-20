import React from 'react'
import './styles.css'
/* Taken from https://css-tricks.com/examples/DragAndDropFileUploading/ */

/** submit - Takes a list of files and returns a promise that resolves when submission has succeeded or failed */
export default function UploadFile ({submit}) {
  const [droppedFiles, setDroppedFiles] = React.useState([])
  const [dragover, setDragover] = React.useState(false)
  const [isUploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [success, setSuccess] = React.useState(false)

  function onSubmit(e) {
    const files = Array.from(e.target.files)
    setDroppedFiles(files);
    // preventing the duplicate submissions if the current one is in progress
    if(isUploading) {
      return false;
    }
    setUploading(true);

    submit(files)
      .then((_) => {setUploading(false); setSuccess(true);})
      .catch((e) => {setUploading(false); setError(e)});
  }

  const onDrop = function (e) {
    e.target = e.dataTransfer;
    onSubmit(e);
  }

  const beginDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragover(true);
  }
  const stopDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragover(false);
}

  const className = "box"
    + (dragover ? ' is-dragover' : '')
    + (isUploading ? ' is-uploading' : '')
    + (error ? ' is-error' : '')
    + (success ? ' is-success' : '')
  return <div className="od-uploadFile">
    <form className={className}
          onSubmit={onSubmit}
          onDragOver={beginDrag}
          onDragEnter={beginDrag}
          onDragLeave={stopDrag}
          onDragExit={stopDrag}
          onDrop={(e) => {stopDrag(e); onDrop(e); return true;}}
          >
      <div className="box__input">
        <svg className="box__icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43">
          <path
            d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"/>
        </svg>
        <input type="file" name="files[]" id="file" className="box__file"
               onChange={onSubmit}
               multiple/>
        <label htmlFor="file">
          <span><strong>Choose a file</strong><span className="box__dragndrop"> or drag it here</span>.</span>
        </label>
        <button type="submit" className="box__button">Upload</button>
      </div>
      <div className="box__uploading">Uploading {JSON.stringify(droppedFiles.map(x=>x.name))}</div>
      <div className="box__success">Done!</div>
      <div className="box__error">Error: {JSON.stringify(error)}</div>
    </form>
  </div>
}
