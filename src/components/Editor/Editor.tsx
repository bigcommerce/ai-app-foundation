import { Flex } from '@bigcommerce/big-design';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';
import { useState } from 'react';

type EditorProps = {
  onChange: (content: string) => void;
  initialValue: string;
  onInit: () => void;
};

export default function Editor({
  initialValue,
  onChange,
  onInit,
}: EditorProps) {
  const [initialized, setInitialized] = useState(false);

  return (
    <Flex style={{ display: initialized ? 'block' : 'none' }}>
      <TinyMCEEditor
        value={initialValue}
        onEditorChange={(newValue) => onChange(newValue)}
        onInit={() => {
          setInitialized(true);
          onInit();
        }}
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'charmap',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'table',
            'preview',
            'help',
            'wordcount',
            'codesample',
            'backcolor',
            'pagebreak',
            'powerpaste',
          ],
          toolbar:
            'blocks fontfamily fontsize bullist numlist fullscreen |' +
            'outdent indent | alignleft aligncenter alignright alignjustify | bold italic underline |' +
            'table tableofcontents pagebreak |' +
            'link codesample forecolor backcolor removeformat | help',
          content_style:
            'body { font-family:Source Sans 3,latin; font-size:14px }',
          branding: false,
        }}
      />
    </Flex>
  );
}
