import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import cryptoConstants from 'src/shared/constants/crypto_constants.json';
import useGetServerSession from 'src/shared/hooks/useGetSessionServer';
import useSupabaseServer from 'src/shared/utils/supabase/server';

export async function POST(request: NextRequest) {
  const session = await useGetServerSession();
  if (!session)
    return NextResponse.json(
      { Message: 'unauthorized', error: 'user have not session auth' },
      { status: 405 }
    );

  const supabase = useSupabaseServer();

  const formData = await request.formData();

  const file = formData.get('file');

  const descrioption = formData.get('description') || '';

  if (!file) {
    console.log('No files received.');
    return NextResponse.json(
      { Message: 'Bed Request', error: 'No files received.' },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await (file as File).arrayBuffer());
  const filename = (file as File).name.replaceAll(' ', '_');

  const keyBuffer = Buffer.from(cryptoConstants.key.data);
  const ivBuffer = Buffer.from(cryptoConstants.iv.data);
  const cipher = crypto.createCipheriv(
    cryptoConstants.algorythm,
    keyBuffer,
    ivBuffer
  );
  let encrypted = cipher.update(buffer);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  const filePath = `${session.user.id}/${filename}`;

  try {
    const { data, error } = await supabase.storage
      .from('file_bucket')
      .upload(filePath, encrypted, {
        contentType: (file as File).type,
        upsert: true,
      });

    if (error) throw error;

    if (data)
      await supabase.from('Files').upsert({
        user_id: session.user.id,
        file_id: data.id,
        file_description: descrioption,
        download_count: 0,
      });

    return NextResponse.json({ Message: 'Success', status: 201 });
  } catch (error) {
    console.log('Error occured ', error);
    return NextResponse.json({ Message: 'Failed', error, status: 500 });
  }
}
