import { useGetAllUsersQuery } from '@/store/api/adminApi';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Users, User } from 'lucide-react';

export function UserDirectoryPage() {
  const { data: usersRes, isLoading } = useGetAllUsersQuery();
  const users = usersRes?.data || [];

  return (
    <>
      <PageHeader title="User Directory" description="View all registered users across the platform" />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
      ) : users.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon={Users} title="No users found" description="There are no registered users on the platform yet." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {users.map((user) => (
            <Card key={user.id} className="overflow-hidden hover:shadow-md transition-shadow border-primary/10 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-semibold text-lg truncate">{user.firstName} {user.secondName}</h3>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {user.roles && user.roles.map(role => (
                    <Badge key={role} variant={role === 'ADMIN' ? 'default' : 'secondary'} className="text-xs">
                      {role}
                    </Badge>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
                  <span>Joined</span>
                  <span className="font-medium text-foreground">
                    {user.dateCreated ? new Date(user.dateCreated).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
