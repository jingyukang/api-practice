import React, { useEffect, useState, useMemo } from "react";
import "./App.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import HTMLReactParser from "html-react-parser";
import Axios from "axios";

const App = React.memo(() => {
  const [movieContent, setMovieContent] = useState({
    title: "",
    content: "",
  });

  const [viewContent, setViewContent] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:8000/api/get").then((response) =>
      setViewContent(response.data)
    );
  }, [viewContent]);

  const submitReview = () => {
    Axios.post("http://localhost:8000/api/insert", {
      title: movieContent.title,
      content: movieContent.content,
    }).then(() => {
      alert("Success");
    });
  };

  const getValue = (e) => {
    const { name, value } = e.target;
    setMovieContent({
      ...movieContent,
      [name]: value,
    });
    console.log(movieContent);
  };

  return (
    <div className="App">
      <h1>Movie Review</h1>
      <div className="movie-container">
        {viewContent.map((element) => {
          return (
            <div>
              <h2>{element.title}</h2>
              <div>{HTMLReactParser(element.content)}</div>
            </div>
          );
        })}
        <h2>Title</h2>
        <div>Contents</div>
      </div>

      <div className="form-wrapper">
        <input
          className="title-input"
          type="text"
          placeholder="Title of movie"
          onChange={getValue}
          name="title"
        />
        <CKEditor
          editor={ClassicEditor}
          data="<p>Hello from CKEditor 5!</p>"
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
            console.log("Editor is ready to use!", editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            console.log({ event, editor, data });
            setMovieContent({
              ...movieContent,
              content: data,
            });
            console.log(movieContent);
          }}
          onBlur={(event, editor) => {
            console.log("Blur.", editor);
          }}
          onFocus={(event, editor) => {
            console.log("Focus.", editor);
          }}
        />
      </div>

      <button
        className="submit-button"
        onClick={submitReview}
        //   onClick={() => setViewContent(viewContent.concat({ ...movieContent }))}
      >
        Submit
      </button>
    </div>
  );
});

export default App;
