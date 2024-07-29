import { File } from '@phosphor-icons/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'src/shared/ui/components/chadcn/ui/accordion';
import { Button } from 'src/shared/ui/components/chadcn/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'src/shared/ui/components/chadcn/ui/card';
import useSupabaseBrowser from 'src/shared/utils/supabase/client';

interface FileCardProps {
  file;
}

export default function FileCard({ file }: FileCardProps) {
  const supabase = useSupabaseBrowser();
  const handleFileSize = (fileSizeInBits) => {
    const bitsInByte = 8;
    const bytesInKB = 1024;
    const bytesInMB = 1024 * 1024;

    const sizeInBytes = fileSizeInBits / bitsInByte;
    const sizeInKB = sizeInBytes / bytesInKB;
    const sizeInMB = sizeInBytes / bytesInMB;

    let formattedSize;

    if (sizeInMB >= 1) {
      formattedSize = `${sizeInMB.toFixed(2)} MB`;
    } else if (sizeInKB >= 1) {
      formattedSize = `${sizeInKB.toFixed(2)} KB`;
    } else {
      formattedSize = `${sizeInBytes.toFixed(2)} Bytes`;
    }

    return <span>{formattedSize}</span>;
  };

  const handleDownload = async () => {
    const blob = await fetch(`/files/download?file=${file.id}`).then((res) =>
      res.blob()
    );
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className=" max-w-screen sm:max-w-72 w-full">
      <CardHeader>
        <div className="bg-slate-600 rounded-md w-full p-4 h-24 flex flex-col justify-center items-center">
          <File />
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className={'truncate'}>{file.name}</CardTitle>
        <CardDescription>{file.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Accordion type="single" collapsible className="w-full z-10 bg-black ">
          <AccordionItem value="#">
            <div className="flex flex-row justify-between">
              <AccordionTrigger>
                <></>
              </AccordionTrigger>
              <Button onClick={handleDownload}>Download</Button>
            </div>
            <AccordionContent className="">
              <p>Size: {handleFileSize(file.metadata.size)}</p>
              <hr />
              <p>ID: {file.id}</p>
              <hr />
              <p>Extansion: {file.metadata.mimetype}</p>
              <hr />
              <p>Downloads: {file.download_count}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardFooter>
    </Card>
  );
}
