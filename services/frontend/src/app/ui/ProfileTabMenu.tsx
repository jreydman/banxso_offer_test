'use client';

import Link from 'next/link';
import { useRef } from 'react';
import useSessionLogout from 'src/shared/hooks/useSessionLogout';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from 'src/shared/ui/components/chadcn/ui/avatar';
import { Button } from 'src/shared/ui/components/chadcn/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'src/shared/ui/components/chadcn/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'src/shared/ui/components/chadcn/ui/dropdown-menu';
import { useAuthContext } from 'src/shared/utils/supabase/session.context';
import UploaderDragDrop from './UploaderDragDrop';

export default function ProfileTabMenu() {
  const logoutCallback = useSessionLogout();
  const { session, isLoading } = useAuthContext();
  const dialogTrigger = useRef(null);

  return (
    <div>
      {!session ? (
        <></>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarFallback>PR</AvatarFallback>
              <AvatarImage
                src={session.user.user_metadata.picture}
                alt="avatar"
              />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={'/profile'}>Profile</Link>
            </DropdownMenuItem>

            <Dialog>
              <DialogTrigger ref={dialogTrigger} asChild>
                <Button>Upload</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload new file</DialogTitle>
                </DialogHeader>
                <DialogContent>
                  <UploaderDragDrop dialogTrigger={dialogTrigger} />
                </DialogContent>
                <DialogFooter>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're
                    done.
                  </DialogDescription>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <DropdownMenuItem onClick={logoutCallback}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
