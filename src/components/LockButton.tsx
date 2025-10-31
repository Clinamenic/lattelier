import { LockIcon, UnlockIcon } from './icons';
import { useAppStore } from '../state/app-store';

interface LockButtonProps {
    settingKey: string;
    locked: boolean;
    className?: string;
}

export function LockButton({ settingKey, locked, className = '' }: LockButtonProps) {
    const toggleSettingLock = useAppStore((state) => state.toggleSettingLock);

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                toggleSettingLock(settingKey);
            }}
            className={`btn btn-icon-only btn-lock ${locked ? 'btn-locked' : ''} ${className}`}
            title={locked ? 'Unlock (allow shuffle)' : 'Lock (preserve on shuffle)'}
            aria-label={locked ? 'Unlock' : 'Lock'}
        >
            {locked ? (
                <LockIcon className="icon" size={16} />
            ) : (
                <UnlockIcon className="icon" size={16} />
            )}
        </button>
    );
}

