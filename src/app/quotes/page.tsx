'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/utils/auth';
import { useQuotes } from '@/hooks/useQuotes';
import { useModals } from '@/hooks/useModals';
import { useQuoteFilters } from '@/hooks/useQuoteFilters';
import { Quote } from '@/api/quotes';

import QuotesHeader from '@/components/quotes/QuotesHeader';
import QuotesFilter from '@/components/quotes/QuotesFilter';
import QuotesGrid from '@/components/quotes/QuotesGrid';
import CreateQuoteModal from '@/components/modals/CreateQuoteModal';
import EditQuoteModal from '@/components/modals/EditQuoteModal';
import DeleteQuoteModal from '@/components/modals/DeleteQuoteModal';
import VoteConfirmationModal from '@/components/modals/VoteConfirmationModal';
import Notification from '@/components/ui/Notification';

export default function QuotesPage() {
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
    }
  }, [router]);
  const {
    quotes,
    loading,
    error,
    userVotedQuoteId,
    votingInProgress,
    voteMessage,
    setVoteMessage,
    actions,
  } = useQuotes();

  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const { filters, setFilters, resetFilters } = useQuoteFilters(quotes, setFilteredQuotes);

  const {
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    quoteToEdit,
    quoteToDelete,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    closeModal,
  } = useModals();

  const [showVoteConfirm, setShowVoteConfirm] = useState<number | null>(null);

  useEffect(() => {
    setFilteredQuotes(quotes);
  }, [quotes]);

  const handleVoteClick = (quoteId: number) => {
    if (userVotedQuoteId !== null) {
      setVoteMessage({ type: 'error', text: 'You have already voted.' });
      return;
    }
    setShowVoteConfirm(quoteId);
  };

  const handleVoteConfirm = async () => {
    if (showVoteConfirm) {
      await actions.voteQuote(showVoteConfirm);
      setShowVoteConfirm(null);
    }
  };

  const handleCreateSubmit = async (newQuote: { content: string; author: string }) => {
    const created = await actions.createQuote(newQuote);
    if (created) closeModal();
  };

  const handleEditSubmit = async (updatedQuote: Quote) => {
    const result = await actions.updateQuote(updatedQuote);
    if (result) closeModal();
  };

  const handleDeleteConfirm = async () => {
    if (quoteToDelete) {
      await actions.deleteQuote(quoteToDelete.id);
      closeModal();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <QuotesHeader openCreateModal={openCreateModal} />

        <Notification message={voteMessage} onClose={() => setVoteMessage(null)} />

        <QuotesFilter filters={filters} setFilters={setFilters} resetFilters={resetFilters} />

        <QuotesGrid
          quotes={filteredQuotes}
          loading={loading}
          error={error}
          userVotedQuoteId={userVotedQuoteId}
          votingInProgress={votingInProgress}
          onVoteClick={handleVoteClick}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />
      </main>

      <CreateQuoteModal
        isOpen={isCreateModalOpen}
        onClose={closeModal}
        onSubmit={handleCreateSubmit}
      />

      {quoteToEdit && (
        <EditQuoteModal
          isOpen={isEditModalOpen}
          onClose={closeModal}
          onSubmit={handleEditSubmit}
          quote={quoteToEdit}
        />
      )}

      {quoteToDelete && (
        <DeleteQuoteModal
          isOpen={isDeleteModalOpen}
          onClose={closeModal}
          onConfirm={handleDeleteConfirm}
          loading={votingInProgress === quoteToDelete.id}
        />
      )}

      <VoteConfirmationModal
        isOpen={showVoteConfirm !== null}
        onCancel={() => setShowVoteConfirm(null)}
        onConfirm={handleVoteConfirm}
        isLoading={votingInProgress !== null}
      />
    </div>
  );
}