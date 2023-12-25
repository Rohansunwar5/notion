'use client'

import { appFoldersType, appWorkspacesType, useAppState } from '@/lib/providers/state-provider'
import { File, Folder, workspace } from '@/lib/supabase/supabase.types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React from 'react'
import { useForm } from 'react-hook-form';
import { UploadBannerFormSchema } from '@/lib/types';

interface BannerUploadFormProps {
  details: appWorkspacesType | appFoldersType | File | workspace | Folder;
  dirType: 'workspace' | 'file' | 'folder';
  id: string;
}

const BannerUploadForm:React.FC<BannerUploadFormProps> = ({
  details,
  dirType,
  id,
}) => {
  const supabase = createClientComponentClient();
  const { state, workspaceId, folderId, dispatch } = useAppState();
  const {
    register, 
    handleSubmit, 
    reset, 
    formState: { isSubmitting: isUploading, errors}, 
  } = useForm<z.infer<typeof UploadBannerFormSchema>>({mode: 'onChange', defaultValues: {
    banner: '',
  },
});
  return (
    <div>BannerUploadForm</div>
  )
}
//8:17 zod pass
export default BannerUploadForm