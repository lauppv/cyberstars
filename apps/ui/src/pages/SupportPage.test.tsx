import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { AuthenticatedUser } from '@cyberstars/shared/auth';
import type { SupportTicketDTO, SupportMessageDTO } from '@cyberstars/shared/support';

vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }));
const route = vi.hoisted(() => ({ search: '', setSearchParams: vi.fn() }));
vi.mock('react-router', () => ({
  useSearchParams: () => [new URLSearchParams(route.search), route.setSearchParams],
}));
vi.mock('../components/layout/Topbar', () => ({
  Topbar: () => <nav data-testid="topbar">Topbar</nav>,
}));
vi.mock('../services/supportService', () => ({
  createTicket: vi.fn(),
  getMyTickets: vi.fn(),
  getAllTickets: vi.fn(),
  updateTicketStatus: vi.fn(),
  getTicketMessages: vi.fn(),
  addTicketMessage: vi.fn(),
}));

const { useAuth } = await import('../context/AuthContext');
const mockUseAuth = vi.mocked(useAuth);
const supportService = await import('../services/supportService');
const mockCreateTicket = vi.mocked(supportService.createTicket);
const mockGetMyTickets = vi.mocked(supportService.getMyTickets);
const mockGetAllTickets = vi.mocked(supportService.getAllTickets);
const mockUpdateStatus = vi.mocked(supportService.updateTicketStatus);
const mockGetMessages = vi.mocked(supportService.getTicketMessages);
const mockAddMessage = vi.mocked(supportService.addTicketMessage);

const { SupportPage } = await import('./SupportPage');

// jsdom has no scrollIntoView; the conversation scrolls to its end with it.
Element.prototype.scrollIntoView = vi.fn();

const student = { id: 1, name: 'Nova', role: 'USER' } as AuthenticatedUser;
const admin = { id: 9, name: 'Ada', role: 'ADMIN' } as AuthenticatedUser;

const ticket: SupportTicketDTO = {
  id: 7,
  type: 'BUG',
  subject: 'Run is stuck',
  message: 'It spins forever',
  status: 'OPEN',
  createdAt: '2026-10-20T10:00:00.000Z',
  updatedAt: '2026-10-20T10:00:00.000Z',
} as SupportTicketDTO;

const reply: SupportMessageDTO = {
  id: 1,
  userId: 9,
  authorName: 'Ada',
  isAdmin: true,
  message: 'Looking into it',
  createdAt: '2026-10-20T11:00:00.000Z',
} as SupportMessageDTO;

function signIn(user: AuthenticatedUser) {
  mockUseAuth.mockReturnValue({
    user,
    isLoggedIn: true,
    isLoading: false,
  } as unknown as ReturnType<typeof useAuth>);
}

const GENERAL = 'Something went wrong. Please try again.';

beforeEach(() => {
  vi.clearAllMocks();
  route.search = '';
  signIn(student);
  mockGetMyTickets.mockResolvedValue([ticket]);
  mockGetAllTickets.mockResolvedValue([{ ...ticket, authorName: 'Nova' }]);
  mockGetMessages.mockResolvedValue([reply]);
  mockCreateTicket.mockResolvedValue({ ticketId: 8 });
  mockUpdateStatus.mockResolvedValue({ ok: true });
  mockAddMessage.mockResolvedValue({ ok: true });
});

async function openTicket() {
  render(<SupportPage />);
  fireEvent.click(await screen.findByText('Run is stuck'));
  await screen.findByText('Looking into it');
}

describe('SupportPage', () => {
  describe('the ticket form', () => {
    function fillForm() {
      fireEvent.change(screen.getByPlaceholderText('Subject'), {
        target: { value: 'Broken editor' },
      });
      fireEvent.change(screen.getByPlaceholderText('Describe the issue or question in detail...'), {
        target: { value: 'It froze' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Submit ticket' }));
    }

    it('says the ticket went in and empties the form', async () => {
      render(<SupportPage />);
      fillForm();
      expect(await screen.findByText('Ticket submitted!')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Subject')).toHaveValue('');
      expect(screen.queryByRole('alert')).toBeNull();
    });

    it('says why a ticket was not sent and keeps the text', async () => {
      mockCreateTicket.mockRejectedValueOnce(new Error('Subject is required'));
      render(<SupportPage />);
      fillForm();
      expect(await screen.findByRole('alert')).toHaveTextContent('Subject is required');
      expect(screen.getByPlaceholderText('Subject')).toHaveValue('Broken editor');
      expect(
        screen.getByPlaceholderText('Describe the issue or question in detail...'),
      ).toHaveValue('It froze');
      expect(screen.queryByText('Ticket submitted!')).toBeNull();
    });
  });

  describe('the lists', () => {
    it('says there are no tickets only when the list loaded empty', async () => {
      mockGetMyTickets.mockResolvedValue([]);
      render(<SupportPage />);
      expect(await screen.findByText("You haven't opened any tickets yet.")).toBeInTheDocument();
    });

    it('shows nothing in place of the list while it loads', () => {
      mockGetMyTickets.mockReturnValue(new Promise(() => {}));
      render(<SupportPage />);
      expect(screen.queryByText("You haven't opened any tickets yet.")).toBeNull();
    });

    it("says the student's tickets didn't load, and a retry brings them", async () => {
      mockGetMyTickets.mockRejectedValueOnce('nope');
      render(<SupportPage />);
      expect(await screen.findByRole('alert')).toHaveTextContent(GENERAL);
      expect(screen.queryByText("You haven't opened any tickets yet.")).toBeNull();
      fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
      expect(await screen.findByText('Run is stuck')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).toBeNull();
    });

    it("says the admin's list didn't load, and a retry brings it", async () => {
      signIn(admin);
      mockGetMyTickets.mockResolvedValue([]);
      mockGetAllTickets.mockRejectedValueOnce(new Error('Admin access required'));
      render(<SupportPage />);
      expect(await screen.findByRole('alert')).toHaveTextContent('Admin access required');
      expect(screen.queryByText('No tickets from anyone yet.')).toBeNull();
      fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
      expect(await screen.findByText('Run is stuck')).toBeInTheDocument();
    });
  });

  describe('an open ticket', () => {
    it('sends a reply and empties the box', async () => {
      await openTicket();
      fireEvent.change(screen.getByPlaceholderText('Type a reply...'), {
        target: { value: 'Thanks' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Send' }));
      await waitFor(() => expect(screen.getByPlaceholderText('Type a reply...')).toHaveValue(''));
      expect(mockAddMessage).toHaveBeenCalledWith(7, 'Thanks');
    });

    it('says why a reply was not sent and keeps the text', async () => {
      mockAddMessage.mockRejectedValueOnce(new Error('Ticket not found'));
      await openTicket();
      fireEvent.change(screen.getByPlaceholderText('Type a reply...'), {
        target: { value: 'Thanks' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Send' }));
      expect(await screen.findByRole('alert')).toHaveTextContent('Ticket not found');
      expect(screen.getByPlaceholderText('Type a reply...')).toHaveValue('Thanks');
    });

    it("says the messages didn't load, and a retry brings them", async () => {
      mockGetMessages.mockRejectedValueOnce('nope');
      render(<SupportPage />);
      fireEvent.click(await screen.findByText('Run is stuck'));
      expect(await screen.findByRole('alert')).toHaveTextContent(GENERAL);
      fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
      expect(await screen.findByText('Looking into it')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).toBeNull();
    });

    it('shows a ticket marked as solved as closed at once', async () => {
      await openTicket();
      fireEvent.click(screen.getByRole('button', { name: '✓ Mark as solved' }));
      expect(await screen.findByText('Closed')).toBeInTheDocument();
      expect(mockUpdateStatus).toHaveBeenCalledWith(7, 'CLOSED');
      expect(screen.queryByRole('button', { name: '✓ Mark as solved' })).toBeNull();
      expect(screen.queryByPlaceholderText('Type a reply...')).toBeNull();
    });

    it('says why marking as solved failed and leaves the ticket open', async () => {
      mockUpdateStatus.mockRejectedValueOnce(new Error('You can only close your own tickets'));
      await openTicket();
      fireEvent.click(screen.getByRole('button', { name: '✓ Mark as solved' }));
      expect(await screen.findByRole('alert')).toHaveTextContent(
        'You can only close your own tickets',
      );
      expect(screen.getByRole('button', { name: '✓ Mark as solved' })).toBeInTheDocument();
    });

    describe("an admin's status change", () => {
      async function openAsAdmin() {
        signIn(admin);
        mockGetMyTickets.mockResolvedValue([]);
        render(<SupportPage />);
        fireEvent.click(await screen.findByText('Run is stuck'));
        await screen.findByText('Looking into it');
        return screen.getByRole('combobox');
      }

      it('shows the new status', async () => {
        const picker = await openAsAdmin();
        fireEvent.change(picker, { target: { value: 'IN_PROGRESS' } });
        await waitFor(() => expect(picker).toHaveValue('IN_PROGRESS'));
        expect(mockUpdateStatus).toHaveBeenCalledWith(7, 'IN_PROGRESS');
      });

      it('says why it failed and keeps the old status', async () => {
        mockUpdateStatus.mockRejectedValueOnce('nope');
        const picker = await openAsAdmin();
        fireEvent.change(picker, { target: { value: 'RESOLVED' } });
        expect(await screen.findByRole('alert')).toHaveTextContent(GENERAL);
        expect(picker).toHaveValue('OPEN');
      });
    });
  });

  describe('a ticket opened from its notification', () => {
    it("opens the student's own ticket and drops the id from the address", async () => {
      route.search = 'ticket=7';
      render(<SupportPage />);
      expect(await screen.findByText('Looking into it')).toBeInTheDocument();
      expect(mockGetMessages).toHaveBeenCalledWith(7);
      expect(route.setSearchParams).toHaveBeenCalledWith({}, { replace: true });
    });

    it("opens someone else's ticket for an admin once the full list is in", async () => {
      signIn(admin);
      mockGetMyTickets.mockResolvedValue([]);
      route.search = 'ticket=7';
      render(<SupportPage />);
      expect(await screen.findByText('Looking into it')).toBeInTheDocument();
      expect(mockGetAllTickets).toHaveBeenCalled();
    });

    it('shows the lists when the ticket is in none of them', async () => {
      route.search = 'ticket=99';
      render(<SupportPage />);
      await waitFor(() =>
        expect(route.setSearchParams).toHaveBeenCalledWith({}, { replace: true }),
      );
      expect(screen.getByText('Run is stuck')).toBeInTheDocument();
      expect(mockGetMessages).not.toHaveBeenCalled();
    });
  });
});
