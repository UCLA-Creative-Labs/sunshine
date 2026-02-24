 "use client";
 
 import React, { useState, useEffect } from 'react';
 import { UpdateTaskInput, TASK_LABELS } from '@/lib/types/tasks';
 import { TaskStatus, TaskPriority, TaskWithAssignments } from '@/lib/types/database';
 
 interface EditTaskModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSubmit: (input: UpdateTaskInput) => Promise<void>;
   task: TaskWithAssignments;
   isSubmitting?: boolean;
 }
 
 const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
   { value: 'todo', label: 'Todo' },
   { value: 'in_progress', label: 'In Progress' },
   { value: 'in_review', label: 'In Review' },
   { value: 'done', label: 'Done' },
 ];
 
 const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
   { value: 'low', label: 'Low' },
   { value: 'medium', label: 'Medium' },
   { value: 'high', label: 'High' },
   { value: 'urgent', label: 'Urgent' },
 ];
 
 /**
  * dialog for editing an existing task
  */
 export function EditTaskModal({
   isOpen,
   onClose,
   onSubmit,
   task,
   isSubmitting = false,
 }: EditTaskModalProps) {
   const [name, setName] = useState('');
   const [description, setDescription] = useState('');
   const [status, setStatus] = useState<TaskStatus>('todo');
   const [priority, setPriority] = useState<TaskPriority>('medium');
   const [dueDate, setDueDate] = useState('');
   const [labelIndex, setLabelIndex] = useState(0);
   const [errors, setErrors] = useState<Record<string, string>>({});
 
   useEffect(() => {
     if (isOpen && task) {
       setName(task.name || '');
       setDescription(task.description || '');
       setStatus(task.status);
       setPriority(task.priority);
       
       if (task.due_date) {
         const date = new Date(task.due_date);
         const formattedDate = date.toISOString().split('T')[0];
         setDueDate(formattedDate);
       } else {
         setDueDate('');
       }
 
       const foundLabelIndex = TASK_LABELS.findIndex(
         label => label.name === task.label
       );
       setLabelIndex(foundLabelIndex >= 0 ? foundLabelIndex : 0);
     }
   }, [isOpen, task]);
 
   const validate = (): boolean => {
     const newErrors: Record<string, string> = {};
 
     if (!name.trim()) newErrors.name = 'Task name is required';
     if (!description.trim()) newErrors.description = 'Description is required';
     if (!dueDate) newErrors.dueDate = 'Due date is required';
 
     setErrors(newErrors);
     return Object.keys(newErrors).length === 0;
   };
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
 
     if (!validate()) return;
 
     const selectedLabel = TASK_LABELS[labelIndex];
 
     const input: UpdateTaskInput = {
       name: name.trim(),
       description: description.trim(),
       status,
       priority,
       due_date: new Date(dueDate).toISOString(),
       label: selectedLabel.name,
       label_color: selectedLabel.color,
     };
 
     await onSubmit(input);
   };
 
   if (!isOpen) return null;
 
   const handleBackdropClick = (e: React.MouseEvent) => {
     if (e.target === e.currentTarget) {
       onClose();
     }
   };
 
   const inputClass = "w-full rounded-lg border border-[#D4D7E5] px-4 py-2 text-sm focus:border-[#3F86FF] focus:outline-none";
   const labelClass = "mb-1 block text-sm font-medium text-black/70";
   const errorClass = "mt-1 text-xs text-red-500";
 
   return (
     <div
       className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
       onClick={handleBackdropClick}
     >
       <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
         <div className="mb-6 flex items-center justify-between">
           <h2 className="text-xl font-semibold">Edit Task</h2>
           <button
             onClick={onClose}
             className="text-black/50 hover:text-black"
             aria-label="Close modal"
           >
             <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>
         </div>
 
         <form onSubmit={handleSubmit} className="space-y-4">
           <div>
             <label className={labelClass}>Task Name *</label>
             <input
               type="text"
               value={name}
               onChange={(e) => setName(e.target.value)}
               className={inputClass}
               placeholder="Enter task name"
             />
             {errors.name && <p className={errorClass}>{errors.name}</p>}
           </div>
 
           <div>
             <label className={labelClass}>Description *</label>
             <textarea
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               className={`${inputClass} min-h-[80px] resize-none`}
               placeholder="Describe the task"
             />
             {errors.description && <p className={errorClass}>{errors.description}</p>}
           </div>
 
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className={labelClass}>Status *</label>
               <select
                 value={status}
                 onChange={(e) => setStatus(e.target.value as TaskStatus)}
                 className={inputClass}
               >
                 {STATUS_OPTIONS.map(opt => (
                   <option key={opt.value} value={opt.value}>{opt.label}</option>
                 ))}
               </select>
             </div>
             <div>
               <label className={labelClass}>Priority *</label>
               <select
                 value={priority}
                 onChange={(e) => setPriority(e.target.value as TaskPriority)}
                 className={inputClass}
               >
                 {PRIORITY_OPTIONS.map(opt => (
                   <option key={opt.value} value={opt.value}>{opt.label}</option>
                 ))}
               </select>
             </div>
           </div>
 
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className={labelClass}>Due Date *</label>
               <input
                 type="date"
                 value={dueDate}
                 onChange={(e) => setDueDate(e.target.value)}
                 className={inputClass}
               />
               {errors.dueDate && <p className={errorClass}>{errors.dueDate}</p>}
             </div>
             <div>
               <label className={labelClass}>Label *</label>
               <select
                 value={labelIndex}
                 onChange={(e) => setLabelIndex(Number(e.target.value))}
                 className={inputClass}
               >
                 {TASK_LABELS.map((label, idx) => (
                   <option key={label.name} value={idx}>{label.name}</option>
                 ))}
               </select>
             </div>
           </div>
 
           <div className="flex justify-end gap-3 pt-4">
             <button
               type="button"
               onClick={onClose}
               className="rounded-lg border border-[#D4D7E5] px-4 py-2 text-sm font-medium text-black/70 hover:bg-gray-50"
               disabled={isSubmitting}
             >
               Cancel
             </button>
             <button
               type="submit"
               className="rounded-lg bg-[#3F86FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#346edd] disabled:opacity-50"
               disabled={isSubmitting}
             >
               {isSubmitting ? 'Saving...' : 'Save Changes'}
             </button>
           </div>
         </form>
       </div>
     </div>
   );
 }
