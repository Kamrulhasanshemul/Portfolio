
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

// Hardcoded for reliability in this debug session
const supabaseUrl = 'https://dttkwomsrqrjshuutiac.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0dGt3b21zcnFyanNodXV0aWFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTA3NjQ3OSwiZXhwIjoyMDY0NjUyNDc5fQ.v6ST2kVQ2LxMXtCVruJezcsy2Bd-YMUP9-gh4fEg2xc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCRUD() {
    console.log('--- STARTING CRUD TEST ---');
    const slug = `debug-crud-${Date.now()}`;
    const payload = {
        title: 'Debug CRUD Project',
        slug: slug,
        short_description: 'Testing CRUD operations',
        status: 'draft',
        technologies: ['Debug'],
        is_featured: false // Intentionally including this to test if it fails
    };

    console.log('1. Attempting CREATE (INSERT)...');
    let { data: paramsData, error: insertError } = await supabase
        .from('project_details')
        .insert(payload)
        .select()
        .single();

    if (insertError) {
        console.error('CREATE FAILED:', insertError.message);
        if (insertError.message.includes('column "is_featured" does not exist')) {
            console.log('>> RETRYING CREATE without is_featured...');
            delete payload.is_featured;
            const retry = await supabase.from('project_details').insert(payload).select().single();
            if (retry.error) {
                console.error('>> RETRY FAILED:', retry.error.message);
                return;
            }
            paramsData = retry.data;
            console.log('>> RETRY SUCCESS.');
        } else {
            return;
        }
    } else {
        console.log('CREATE SUCCESS.');
    }

    const id = paramsData.id;
    console.log('Project ID:', id);

    console.log('2. Attempting READ (SELECT)...');
    const { data: readData, error: readError } = await supabase
        .from('project_details')
        .select('*')
        .eq('id', id)
        .single();

    if (readError) {
        console.error('READ FAILED:', readError.message);
    } else {
        console.log('READ SUCCESS:', readData.title);
    }

    console.log('3. Attempting UPDATE...');
    const { error: updateError } = await supabase
        .from('project_details')
        .update({ title: 'Debug CRUD Project Updated' })
        .eq('id', id);

    if (updateError) {
        console.error('UPDATE FAILED:', updateError.message);
    } else {
        console.log('UPDATE SUCCESS.');
    }

    console.log('4. Attempting DELETE...');
    const { error: deleteError } = await supabase
        .from('project_details')
        .delete()
        .eq('id', id);

    if (deleteError) {
        console.error('DELETE FAILED:', deleteError.message);
    } else {
        console.log('DELETE SUCCESS.');
    }

    console.log('--- CRUD TEST COMPLETE ---');
}

testCRUD();
