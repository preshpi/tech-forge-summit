import QuestionHub from '@/components/QuestionHub';
export default async function Page({ params }: { params: Promise<{ event: string; session: string }> }) { const { event, session } = await params; return <QuestionHub eventSlug={event} sessionSlug={session}/>; }
