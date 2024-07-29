import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import cryptoConstants from 'src/shared/constants/crypto_constants.json';
import useGetServerSession from 'src/shared/hooks/useGetSessionServer';
import useSupabaseServer from 'src/shared/utils/supabase/server';

export async function GET(request: NextRequest) {
  const session = await useGetServerSession();
  if (!session)
    return NextResponse.json(
      { Message: 'unauthorized', error: 'user have not session auth' },
      { status: 405 }
    );

  const {
    nextUrl: { search },
  } = request;
  const urlSearchParams = new URLSearchParams(search);
  const params = Object.fromEntries(urlSearchParams.entries());

  if (!params.file) {
    console.log('file unchecked');
    return NextResponse.json(
      { Message: 'Bed Request', error: 'file unchecked' },
      { status: 405 }
    );
  }

  const supabase = useSupabaseServer();

  try {
    const fetchFileName = await supabase.storage
      .from('file_bucket')
      .list(session.user.id);

    const currentFile = [...(fetchFileName.data ?? [])].find(
      (file) => file.id === params.file
    );

    if (!currentFile) throw { message: 'file not found' };

    const fetchFileDownload = await supabase.storage
      .from('file_bucket')
      .download(`${session.user.id}/${currentFile.name}`);

    const arrayBuffer = await fetchFileDownload.data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const keyBuffer = Buffer.from(cryptoConstants.key.data);
    const ivBuffer = Buffer.from(cryptoConstants.iv.data);
    const decipher = crypto.createDecipheriv(
      cryptoConstants.algorythm,
      keyBuffer,
      ivBuffer
    );

    let decrypted = decipher.update(buffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    const headers = new Headers();
    headers.set('Content-Type', 'file/*');

    const fetchFilemeta = await supabase
      .from('Files')
      .select('*')
      .eq('file_id', currentFile.id);
    await supabase
      .from('Files')
      .update({ download_count: fetchFilemeta.data[0].download_count + 1 })
      .eq('file_id', currentFile.id);

    return new NextResponse(decrypted, { status: 200, headers });
  } catch (error) {
    console.error('Error handling the request:', error);
    NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
