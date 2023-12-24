'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useToast } from '../ui/use-toast'
import { useAppState } from '@/lib/providers/state-provider';
import { User, workspace } from '@/lib/supabase/supabase.types';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Briefcase, Lock, Plus, Share } from 'lucide-react';
import { Separator } from '@radix-ui/react-select';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { addCollaborators, deleteWorkspace, removeCollaborators, updateWorkspace } from '@/lib/supabase/queries';
import { v4 } from 'uuid';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import CollaboratorSearch from '../global/collaborator-search';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Alert, AlertDescription } from '../ui/alert';

const SettingsForm = () => {
  const {toast} = useToast();
  const { user } = useSupabaseUser();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const {state, workspaceId, dispatch} = useAppState();
  const [permissions, setPermissions ] = useState('private');
  const [collaborators, setCollaborators] = useState<User [] | [] >([]);
  const [openAlertMessage, setOpenAlertMessage] = useState(false);
  const [workspaceDetails, setWorkspaceDetails] = useState<workspace>();
  const titleTimerRef = useRef<ReturnType<typeof setTimeout >>();
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);
  const [uploadingLogo, setUploadinglogo] = useState(false);
  // WIR PAYment portal
  
  //addcollaborators
  //remove collaboratos 
  const removeCollaborator = async (user: User) => {
    if (!workspaceId) return;
    if (collaborators.length === 1) {
      setPermissions('private');
    }
    await removeCollaborators([user], workspaceId);
    setCollaborators(
      collaborators.filter((collaborator) => collaborator.id !== user.id)
    );
    router.refresh();
  };
  // onchange worksapce title 
  // on change 
  const workspaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId || !e.target.value) return;
    dispatch({
      type: 'UPDATE_WORKSPACE',
      payload: { workspace: { title: e.target.value }, workspaceId },
    });
    if (titleTimerRef.current) clearTimeout(titleTimerRef.current);
    titleTimerRef.current = setTimeout(async () => {
      await updateWorkspace({ title: e.target.value }, workspaceId);
    }, 500);
  };
  const onChangeWorkspaceLogo = async (
    e:React.ChangeEvent<HTMLInputElement>
  ) => {
    if(!workspaceId) return;
    const file = e.target.files?.[0];
    if(!file) return;
    const uuid = v4();
    setUploadinglogo(true);
    const {data, error} = await supabase.storage
    .from('workspace-logos')
    .upload(`workspaceLogo.${uuid}`, file, {
        cacheControl: '3600',
        upsert: true,
    });

    if (!error) {
      dispatch({
        type: 'UPDATE_WORKSPACE',
        payload: { workspace: { logo: data.path }, workspaceId },
      });
      await updateWorkspace({ logo: data.path }, workspaceId);
      setUploadinglogo(false);
    }
  }

  //onclicks 

  //fetching avatar details 

  //get all the collaboratos 

  //wip payment portal 

  //addcollaboratos
  const addCollaborator = async (profile: User) => {
    if (!workspaceId) return;
    // if (subscription?.status !== 'active' && collaborators.length >= 2) {
    //   setOpen(true);
    //   return;
    // }
    await addCollaborators([profile], workspaceId);
    setCollaborators([...collaborators, profile]);
    // to refresh out workspace cetogories
    // router.refresh();
  };  

  useEffect(() => {
    const showingWorkspace =state.workspaces.find(
      (workspace) => workspace.id === workspaceId    
    );
    if(showingWorkspace) setWorkspaceDetails(showingWorkspace);
  }, [workspaceId, state]);

  return (
    <div className='flex gap-4 flex-col'>
      <p className='flex items-center gap-2 mt-6'>
        <Briefcase size={20}/>
        Workspace
      </p>
      <Separator /> 
      <div className='flex flex-col gap-2'>
        <Label 
          htmlFor='workspaceName'
          className='text-sm text-muted-foreground'
        >
          Name 
        </Label>
        <Input 
          name='workspaceName'
          value={workspaceDetails ? workspaceDetails.title : ''}
          placeholder='Workspace Name'
          onChange={workspaceNameChange}
        />
        <Label
          htmlFor='workspaceLogo'
          className='text-sm text-muted-foreground'
        >
          Workspace Logo
        </Label>
        <Input 
          name='workspaceLogo'
          type='file'
          accept='image/*'
          placeholder='Workspace Logo'
          onChange={onChangeWorkspaceLogo}

          //WIP subscription
          disabled={uploadingLogo}
        />
        {/* subscription  */}
      </div>
      <>
        <Label htmlFor='permission'>Permission</Label>
        <Select
          onValueChange={(val) => {
            setPermissions(val);
          }}
          defaultValue={permissions}
        >
          <SelectTrigger className="w-full h-26 -mt-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="private">
                <div
                  className="p-2
                  flex
                  gap-4
                  justify-center
                  items-center
                "
                >
                  <Lock />
                  <article className="text-left flex flex-col">
                    <span>Private</span>
                    <p>
                      Your workspace is private to you. You can choose to share
                      it later.
                    </p>
                  </article>
                </div>
              </SelectItem>
              <SelectItem value="shared">
                <div className="p-2 flex gap-4 justify-center items-center">
                  <Share></Share>
                  <article className="text-left flex flex-col">
                    <span>Shared</span>
                    <span>You can invite collaborators.</span>
                  </article>
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {permissions === 'shared' && (
        <div>
          <CollaboratorSearch
            existingCollaborators={collaborators}
            getCollaborator={(user) => {
              addCollaborator(user);
            }}
          >
            <Button
              type="button"
              className="text-sm mt-4"
            >
              <Plus />
              Add Collaborators
            </Button>
          </CollaboratorSearch>
          <div className="mt-4">
            <span className="text-sm text-muted-foreground">
              Collaborators {collaborators.length || ''}
            </span>
            <ScrollArea
              className="
            h-[120px]
            overflow-y-scroll
            w-full
            rounded-md
            border
            border-muted-foreground/20"
            >
              {collaborators.length ? (
                collaborators.map((c) => (
                  <div
                    className="p-4 flex
                      justify-between
                      items-center
                "
                    key={c.id}
                  >
                    <div className="flex gap-4 items-center">
                      <Avatar>
                        <AvatarImage src="/public/avatars/7.png" />
                        <AvatarFallback>PJ</AvatarFallback>
                      </Avatar>
                      <div
                        className="text-sm gap-2 text-muted-foreground overflow-hidden overflow-ellipsis sm:w-[300px] w-[140px]
                        "
                      >
                        {c.email}
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => removeCollaborator(c)}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              ) : (
                <div
                  className="absolute
                  right-0 left-0
                  top-0
                  bottom-0
                  flex
                  justify-center
                  items-center
                "
                >
                  <span className="text-muted-foreground text-sm">
                    You have no collaborators
                  </span>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      )}
      <Alert variant={'destructive'}>
        <AlertDescription>
          Warning!! deleting this workspace will delete your whole data related to this workspace 
        </AlertDescription>
        <Button 
        type='submit'
        size={'sm'}
        variant={'destructive'}
        className='mt-4 text-sm bg-destructive/40 border-2 border-destructive'
        onClick={async () => {
          if(!workspaceId) return; 
          await deleteWorkspace(workspaceId);
          toast({title: 'Successfully deleted your workspace'});
          dispatch({type: 'DELETE_WORKSPACE', payload: workspaceId})
          router.replace('/dashboard');
        }}
        >
          Delete Workspace
        </Button>
      </Alert>
      </>
    </div>
  )
}

export default SettingsForm