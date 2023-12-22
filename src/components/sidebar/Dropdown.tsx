'use client'
import { useAppState } from '@/lib/providers/state-provider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react'
import { Accordion, AccordionTrigger } from '../ui/accordion';
import { AccordionItem } from '@radix-ui/react-accordion';
import clsx from 'clsx';
import EmojiPicker from '../global/emoji-picker';
import { updateFolder } from '@/lib/supabase/queries';
import { useToast } from '../ui/use-toast';

interface DropdownProps {
  title: string;
  id: string;
  listType: 'folder' | 'file';
  iconId: string;
  children?:React.ReactNode;
  disabled?: boolean;
  
}

const Dropdown:React.FC<DropdownProps> = ({
  title,
  id,
  listType,
  iconId,
  children,
  disabled,
  ...props
}) => {

  const supabase = createClientComponentClient();
  const { state, dispatch, workspaceId, folderId } = useAppState();
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  //folder Title synced with server data nad local 
  const folderTitle: string | undefined = useMemo(() => {
    if(listType === 'folder') {
      const stateTitle = state.workspaces
      .find((workspace) => workspace.id === workspaceId)
      ?.folders.find((folder) => folder.id ===id )?.title;
      if(title === stateTitle || !stateTitle) return title;
      return stateTitle;
    }
  }, [state, listType, workspaceId, id, title]);

  
  // fileTitle
  const fileTitle: string | undefined = useMemo(() => {
    if(listType === 'file') {
      const fileAndFolderId = id.split('folder');
      const stateTitle = state.workspaces
      .find((workspace) => workspace.id === workspaceId)
      ?.folders.find((folder) => folder.id === fileAndFolderId[0] )
      ?.files.find((file) => file.id === fileAndFolderId[1])?.title;
     if (title === stateTitle || !stateTitle) return title;
     return stateTitle;
    }
  }, [state, listType, workspaceId, id, title])

  //Naviate the user to a different page 
  const navigatePage = (accordionId: string, type: string) => {
    if(type === 'folder') {
      router.push(`/dashboard/${workspaceId}/${accordionId}`);
    }
    if(type === 'file') {
      router.push(`/dashboard/${workspaceId}/${folderId}/${accordionId}`)
    }
  };


  //add a file 

  // double click a handler 
  //blur 

  //onChanges 
  const onChangeEmoji = async(selectedEmoji:string) => {
    if(!workspaceId) return;
    if(listType === 'folder'){
      dispatch({
        type: 'UPDATE_FOLDER',
        payload:{
          workspaceId,
          folderId: id,
          folder: {iconId: selectedEmoji},
      },
    });
    const {data, error} = await updateFolder({
      iconId: selectedEmoji
    }, id);
    if(error){
      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'Could not update the emoji for thos folder'
      });
    } else {
      toast({
        title: 'Success',
        description: 'Update emoji for the folder',
      })
    }
    }
  }
  //move to Trash
  const isFolder = listType === 'folder';
  const groupIdentifies = clsx('dark:text-white whitespace-nowrap flex justify-between item-center w-full relative',
  {
    'group/folder': isFolder,
    'group/file': isFolder,
  }
  );
  
  const listStyles = useMemo(() => clsx('relative',{
    'border-none text-md': isFolder,
    'border-none ml-6 text-[16px] py-1': !isFolder,
  }), 
  [isFolder]
  )
  return (
    <AccordionItem 
    value={id} 
    className={listStyles}
    onClick={(e) => {
      e.stopPropagation();
      navigatePage(id, listType);    
    }}
    >
      <AccordionTrigger 
        id={listType}
        className='hover:no-underline p-2 dark:text-muted-foreground text-sm'
        disabled={listType === 'file'}
      >
        <div className={groupIdentifies}>
          <div className='flex gap-4 items-center justify-center overflow-hidden'>
            <div className='relative'>
              <EmojiPicker getValue={onChangeEmoji}>{iconId}</EmojiPicker>

            </div>
            <input 
              type="text"
              value={listType === 'folder' ? folderTitle : fileTitle}
              className={clsx(
                'outline-none overflow-hidden w-[140px] text-Neutrals/neutrals-7',
                {
                  'bg-muted cursor-text': isEditing,
                  'bg-transparent cursor-pointer': !isEditing,
                }
              )}
            >
            </input>
          </div>
        </div>
      </AccordionTrigger>
    </AccordionItem>
  )
}

export default Dropdown
// 5:40