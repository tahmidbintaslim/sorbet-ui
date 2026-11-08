'use client';
// @block {"name":"Task list","description":"Checkable tasks with priority chips and a field that adds new ones."}
import * as React from 'react';
import { Box, Container, Divider, Stack, Typography } from '@mui/material';
import { Button, Card, Checkbox, Chip, MenuItem, Select, TextField } from '@sorbet-ui/react';

type Priority = 'High' | 'Medium' | 'Low';
type Task = { id: number; title: string; priority: Priority; done: boolean };

const priorityColor: Record<Priority, 'danger' | 'warning' | 'neutral'> = {
  High: 'danger',
  Medium: 'warning',
  Low: 'neutral',
};

const initial: Task[] = [
  { id: 1, title: 'Review Q4 pricing proposal', priority: 'High', done: false },
  { id: 2, title: 'Reply to Acme Corp onboarding email', priority: 'Medium', done: true },
  { id: 3, title: 'Update the team wiki', priority: 'Low', done: false },
  { id: 4, title: 'Prepare Friday demo', priority: 'High', done: false },
];

export default function DashboardTasks() {
  const [tasks, setTasks] = React.useState<Task[]>(initial);
  const [title, setTitle] = React.useState('');
  const [priority, setPriority] = React.useState<Priority>('Medium');
  const remaining = tasks.filter((t) => !t.done).length;

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    setTasks((list) => [...list, { id: Date.now(), title: t, priority, done: false }]);
    setTitle('');
  };

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="sm">
        <Card variant="outlined" sx={{ p: { xs: 2.5, md: 3 } }}>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>
            My tasks
          </Typography>
          <Typography variant="body2" color="text.secondary" aria-live="polite">
            {remaining} of {tasks.length} remaining
          </Typography>
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 2 }}>
            {tasks.map((t, i) => (
              <Box component="li" key={t.id}>
                {i > 0 && <Divider />}
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', py: 0.75 }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Checkbox
                      size="sm"
                      checked={t.done}
                      onChange={() => setTasks((list) => list.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}
                      label={
                        <Box
                          component="span"
                          sx={{
                            textDecoration: t.done ? 'line-through' : 'none',
                            color: t.done ? 'text.secondary' : 'text.primary',
                            overflowWrap: 'anywhere',
                          }}
                        >
                          {t.title}
                        </Box>
                      }
                    />
                  </Box>
                  <Chip size="xs" variant="soft" color={priorityColor[t.priority]} label={t.priority} />
                </Stack>
              </Box>
            ))}
          </Box>
          <Box component="form" onSubmit={add} sx={{ mt: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                label="New task"
                size="sm"
                variant="soft"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ flex: 1 }}
              />
              <Box sx={{ width: { xs: '100%', sm: 130 } }}>
                <Select
                  label="Priority"
                  size="sm"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  SelectDisplayProps={{ 'aria-label': 'Priority' }}
                >
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </Box>
              <Button type="submit" disabled={!title.trim()}>
                Add task
              </Button>
            </Stack>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
