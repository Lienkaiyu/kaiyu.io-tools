import React, { useState, useEffect, useCallback } from 'react';

export default function ClockTool() {
    const [now, setNow] = useState<Date | null>(null);
    const [timeOffset, setTimeOffset] = useState(0);
    const [isSynced, setIsSynced] = useState(false);
    const [latency, setLatency] = useState<number | null>(null);
    const [lastSync, setLastSync] = useState<Date | null>(null);
    const [syncing, setSyncing] = useState(false);

    const syncTime = useCallback(async () => {
        setSyncing(true);
        try {
            const start = Date.now();
            const response = await fetch('/api/time');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            const end = Date.now();

            const serverTime = data.time;
            const roundTrip = end - start;
            const currentLatency = roundTrip / 2;
            const offset = serverTime + currentLatency - end;

            setTimeOffset(offset);
            setLatency(currentLatency);
            setIsSynced(true);
            setLastSync(new Date());
        } catch (error) {
            console.error('Failed to sync time:', error);
            setIsSynced(false);
        } finally {
            setSyncing(false);
        }
    }, []);

    useEffect(() => {
        syncTime();
        const intervalId = setInterval(syncTime, 60000); // Sync every minute for the tool
        return () => clearInterval(intervalId);
    }, [syncTime]);

    useEffect(() => {
        const updateTime = () => {
            setNow(new Date(Date.now() + timeOffset));
        };
        updateTime();
        const interval = setInterval(updateTime, 16); // ~60fps
        return () => clearInterval(interval);
    }, [timeOffset]);

    const formatTime = (date: Date, timeZone?: string) => {
        return date.toLocaleTimeString('en-GB', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            fractionalSecondDigits: 3,
            timeZone: timeZone
        });
    };

    const formatDate = (date: Date, timeZone?: string) => {
        return date.toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: timeZone
        });
    };

    if (!now) return <div className="tool-card">Loading...</div>;

    return (
        <div className="tool-container">
            <div className="tool-card">
                <h2>Server Time (UTC)</h2>
                <div className="clock-display large">
                    {formatTime(now, 'UTC')}
                </div>
                <div className="date-display">
                    {formatDate(now, 'UTC')}
                </div>
            </div>

            <div className="tool-card">
                <h2>Local Time</h2>
                <div className="clock-display large">
                    {formatTime(now)}
                </div>
                <div className="date-display">
                    {formatDate(now)}
                </div>
                <div className="timezone-display">
                    {Intl.DateTimeFormat().resolvedOptions().timeZone}
                </div>
            </div>

            <div className="tool-card stats-card">
                <h3>Sync Status</h3>
                <div className="stats-grid">
                    <div className="stat-item">
                        <span className="label">Status:</span>
                        <span className={`value ${isSynced ? 'success' : 'error'}`}>
                            {isSynced ? 'Synchronized' : 'Not Synced'}
                        </span>
                    </div>
                    <div className="stat-item">
                        <span className="label">Offset:</span>
                        <span className="value">{timeOffset.toFixed(2)} ms</span>
                    </div>
                    <div className="stat-item">
                        <span className="label">Latency:</span>
                        <span className="value">{latency ? latency.toFixed(2) : '--'} ms</span>
                    </div>
                    <div className="stat-item">
                        <span className="label">Last Sync:</span>
                        <span className="value">{lastSync ? lastSync.toLocaleTimeString() : '--'}</span>
                    </div>
                </div>
                <button className="btn-primary" onClick={syncTime} disabled={syncing}>
                    {syncing ? 'Syncing...' : 'Sync Now'}
                </button>
            </div>
        </div>
    );
}
