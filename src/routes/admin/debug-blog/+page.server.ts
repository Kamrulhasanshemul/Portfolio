
import { ENV } from '$lib/env';
import { env } from '$env/dynamic/private';

export const load = async () => {
    return {
        check: {
            publicUrl: !!ENV.SUPABASE_URL,
            publicKey: !!ENV.SUPABASE_KEY,
            serviceKey: !!env.SUPABASE_SERVICE_ROLE_KEY
        }
    };
};
