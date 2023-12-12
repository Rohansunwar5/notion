import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import React from 'react'
import { cookies } from 'next/headers';
import { getFolders, getUserSubscriptionStatus } from '@/lib/supabase/queries';
import { redirect } from 'next/navigation';

interface SidebarProps {
  params: { workspaceId: string};
  className?: string;
}

const Sidebar:React.FC<SidebarProps> = async ({params, className}) => {
  const supabase = createServerComponentClient({cookies});
  //user 
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if(!user) return;
  //subscription Status
  const { data: subscription, error: subscriptionError } = await getUserSubscriptionStatus(user.id);
  //folder
  const {data: workspaceFolderData, error: foldersError} = await getFolders(params.workspaceId)
  //error
  if(subscriptionError || foldersError) redirect('/dashboard');
  //get all the different workspaces private collaboration
  return (
    <div>Sidebar</div>
  )
}

export default Sidebar