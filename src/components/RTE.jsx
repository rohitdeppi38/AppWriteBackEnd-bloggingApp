import React from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function RTE({ value, onChange, label, defaultValue = "" }) {
  return (
    <div className="w-full">
      {label && <label className="inline-block mb-1 pl-1">{label}</label>}
      <Editor
        apiKey="vy2213hsedbrloeoiwrfgz0kh6s70afvwf6gd11u31hie3cx"
        value={value}
        initialValue={defaultValue}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "emoticons",
            "wordcount",
          ],
          toolbar:
            "undo redo | formatselect | bold italic underline strikethrough | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | link image media table | " +
            "blockquote code | removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
        onEditorChange={onChange}
      />
    </div>
  );
}
