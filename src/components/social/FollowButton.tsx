import { useState } from 'react';
import { useFollow, useUnfollow } from '../../hooks/useSocial';
import { Button } from '../ui/Button';

interface FollowButtonProps {
  targetId: string;
}

export function FollowButton({ targetId }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const follow = useFollow();
  const unfollow = useUnfollow();

  const isPending = follow.isPending || unfollow.isPending;

  async function handleClick() {
    if (isFollowing) {
      await unfollow.mutateAsync(targetId);
      setIsFollowing(false);
    } else {
      await follow.mutateAsync(targetId);
      setIsFollowing(true);
    }
  }

  return (
    <Button
      variant={isFollowing ? 'secondary' : 'primary'}
      loading={isPending}
      onClick={() => void handleClick()}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
}
