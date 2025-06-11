'use client';

import { useState } from 'react';
import { Quote } from '@/api/quotes';

export function useModals() {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [quoteToEdit, setQuoteToEdit] = useState<Quote | null>(null);
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null);

  const openEditModal = (quote: Quote) => {
    setQuoteToEdit(quote);
    setEditModalOpen(true);
  };

  const openDeleteModal = (quote: Quote) => {
    setQuoteToDelete(quote);
    setDeleteModalOpen(true);
  };

  const closeModal = () => {
    setCreateModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setQuoteToEdit(null);
    setQuoteToDelete(null);
  };

  return {
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    quoteToEdit,
    quoteToDelete,
    openCreateModal: () => setCreateModalOpen(true),
    openEditModal,
    openDeleteModal,
    closeModal,
  };
}
