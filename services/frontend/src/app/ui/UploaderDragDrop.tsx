'use client';

import { File } from '@phosphor-icons/react';
import Uppy from '@uppy/core';
import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import { DragDrop, useUppyEvent, useUppyState } from '@uppy/react';
import XHRUpload from '@uppy/xhr-upload';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from 'src/shared/ui/components/chadcn/ui/button';
import { Input } from 'src/shared/ui/components/chadcn/ui/input';
import { Label } from 'src/shared/ui/components/chadcn/ui/label';

interface UploaderDragDropProps {
  dialogTrigger;
}

export default function UploaderDragDrop({
  dialogTrigger,
}: UploaderDragDropProps) {
  const [filename, setFilename] = useState('');
  const [description, setDescription] = useState('');

  const [uppy] = useState(() =>
    new Uppy({
      autoProceed: false,
      allowMultipleUploads: false,
      restrictions: {
        maxNumberOfFiles: 1,
        minNumberOfFiles: 1,
      },
    }).use(XHRUpload, {
      endpoint: '/files/upload',
      formData: true,
      fieldName: 'file',
      headers: {},
    })
  );

  const files = useUppyState(uppy, (state) => state.files);

  useUppyEvent(uppy, 'file-added', (file) => {
    setFilename(file.name ?? '');

    const updatedFiles = {};
    Object.keys(files).forEach((fileID) => {
      updatedFiles[fileID] = {
        ...files[fileID],
        writable: true,
        name: Date.now().toString() + '__' + files[fileID].name,
      };
    });
    return updatedFiles;
  });

  const getCurrentFileOrNull = () => {
    return Object.values(files)[0] ?? null;
  };

  const handleAddClick = async () => {
    const currentfile = getCurrentFileOrNull();
    if (!currentfile) {
      console.log('no files yet');
      return;
    }

    if (!filename.trim()) {
      console.log('Filename cannot be empty');
      return;
    }

    console.log('run upload file', currentfile);

    uppy.setFileMeta(currentfile.id, {
      name: filename,
      description,
    });

    uppy.setMeta({ description });

    const result = await uppy.upload();
    console.log('result below upload', result);
  };

  useUppyEvent(uppy, 'upload-success', () => {
    dialogTrigger.current.click();
    toast('File upload Event', {
      description: 'File upload successfuly',
      action: {
        label: 'Undo',
        onClick: () => console.log('Undo'),
      },
    });
  });

  return (
    <div className="flex flex-col gap-y-4">
      <h1>Upload a File</h1>
      {!getCurrentFileOrNull() ? (
        <DragDrop uppy={uppy} width={454} />
      ) : (
        <div className="bg-slate-600 rounded-md w-full p-4 h-24 flex flex-col justify-center items-center">
          <File />
        </div>
      )}
      <hr />
      <Label>
        Filename:{' '}
        <Input value={filename} onChange={(e) => setFilename(e.target.value)} />
      </Label>
      <Label>
        Description: <Input onChange={(e) => setDescription(e.target.value)} />
      </Label>
      <div className="inline-flex justify-end space-x-4">
        <Button variant={'secondary'}>Cancel</Button>
        <Button disabled={!files} onClick={handleAddClick}>
          Add
        </Button>
      </div>
    </div>
  );
}
