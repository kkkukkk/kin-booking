return (
  <div className="space-y-3">
    {safeTicketGroups.map((group, groupIdx) => {
      const cancelRequestedCount = group.tickets.filter(t => t.status === TicketStatus.CancelRequested).length;
      let status = TicketStatus.Active;
      if (cancelRequestedCount > 0) status = TicketStatus.CancelRequested;
      else if (group.cancelledCount && group.cancelledCount > 0) status = TicketStatus.Cancelled;
      else if (group.usedCount && group.usedCount > 0) status = TicketStatus.Used;
      return (
        <TicketCard
          key={group.eventId || `ticket-group-${groupIdx}`}
          eventName={group.eventName || '알 수 없는 공연'}
          ticketCount={group.totalCount || 0}
          status={status}
          latestCreatedAt={group.latestCreatedAt}
          eventId={group.eventId}
          onCancelRequest={handleCancelAll}
        />
      );
    })}
  </div>
); 