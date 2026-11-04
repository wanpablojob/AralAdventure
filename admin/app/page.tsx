'use client';

import React, { useEffect, useState } from 'react';

type Student = {
  id: string;
  name: string;
  grade_band: string;
  teacher_code: string | null;
  points: number;
  level: number;
  xp: number;
  completed_quests: string[] | null;
  last_synced_at: string | null;
};

type Completion = {
  id: string;
  quest_id: string;
  subject: string;
  grade_band: string;
  score: number;
  total: number;
  completed_at: string;
  players: { name: string; teacher_code: string | null } | null;
};

export default function AdminDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [studentsResponse, completionsResponse] = await Promise.all([
          fetch('/api/students'),
          fetch('/api/completions'),
        ]);

        if (!studentsResponse.ok || !completionsResponse.ok) {
          throw new Error('Unable to load dashboard data.');
        }

        const studentsData = await studentsResponse.json();
        const completionsData = await completionsResponse.json();

        setStudents(studentsData.students ?? []);
        setCompletions(completionsData.completions ?? []);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error ? caughtError.message : 'Unable to load dashboard data.',
        );
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  if (loading) {
    return <main style={styles.container}>Loading teacher dashboard...</main>;
  }

  if (error) {
    return <main style={styles.container}>Error: {error}</main>;
  }

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>AralAdventure Teacher Dashboard</h1>
      <p style={styles.subtitle}>Progress synced from student devices.</p>

      <section style={styles.section}>
        <h2>Students</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Grade</th>
              <th>Teacher code</th>
              <th>Points</th>
              <th>Level</th>
              <th>Completed quests</th>
              <th>Last synced</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.grade_band}</td>
                <td>{student.teacher_code ?? '-'}</td>
                <td>{student.points}</td>
                <td>{student.level}</td>
                <td>{student.completed_quests?.length ?? 0}</td>
                <td>
                  {student.last_synced_at
                    ? new Date(student.last_synced_at).toLocaleString()
                    : 'Never'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={styles.section}>
        <h2>Quest Results</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Quest</th>
              <th>Subject</th>
              <th>Grade</th>
              <th>Score</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {completions.map((completion) => (
              <tr key={completion.id}>
                <td>{completion.players?.name ?? 'Unknown student'}</td>
                <td>{completion.quest_id}</td>
                <td>{completion.subject}</td>
                <td>{completion.grade_band}</td>
                <td>
                  {completion.score}/{completion.total}
                </td>
                <td>{new Date(completion.completed_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

const styles = {
  container: {
    margin: '0 auto',
    maxWidth: 1100,
    padding: 24,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    color: '#555',
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  table: {
    borderCollapse: 'collapse',
    width: '100%',
  },
} as const;
