const supabase = {
  publicURL: process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL as Readonly<string>,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as Readonly<string>,
  serviceKey: process.env.SUPABASE_SERVICE_KEY as Readonly<string>,
  jwtSecret: process.env.SUPABASE_JWT_SECRET as Readonly<string>,
};

export default supabase;
