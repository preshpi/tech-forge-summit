import QuestionHub from '@/components/QuestionHub';
export default async function Page({ params }: { params: Promise<{ event: string }> }) { const { event } = await params; return <QuestionHub eventSlug={event}/>; }
