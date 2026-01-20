import type { Teacher } from "@/app/types/type";

const STORAGE_KEY = "teachers_data";

export const getTeachers = (): Teacher[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getTeacherById = (id: number): Teacher | undefined => {
  const teachers = getTeachers();
  return teachers.find(t => t.id === id);
};

export const createTeacher = (data: Partial<Teacher>) => {
  const teachers = getTeachers();
  const newTeacher: Teacher = {
    id: Date.now(),
    joinDate: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString(),
    ...data,
  } as Teacher;

  teachers.push(newTeacher);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers));
  return newTeacher;
};

export const updateTeacher = (id: number, data: Partial<Teacher>) => {
  const teachers = getTeachers();
  const updatedTeachers = teachers.map(t =>
    t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTeachers));
};

export const deleteTeacher = (id: number) => {
  const teachers = getTeachers();
  const updated = teachers.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
