import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkSupabaseSchema() {
  console.log('🔍 Checking Supabase Database Schema...\n');
  console.log(`Connected to: ${supabaseUrl}\n`);

  try {
    // Check for tables
    console.log('📊 TABLES:');
    console.log('=' .repeat(50));
    
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_schema, table_name')
      .in('table_schema', ['public', 'onet'])
      .order('table_schema', { ascending: true })
      .order('table_name', { ascending: true });

    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
    } else if (tables) {
      const groupedTables = tables.reduce((acc, table) => {
        if (!acc[table.table_schema]) acc[table.table_schema] = [];
        acc[table.table_schema].push(table.table_name);
        return acc;
      }, {} as Record<string, string[]>);

      for (const [schema, tableList] of Object.entries(groupedTables)) {
        console.log(`\n${schema} schema:`);
        tableList.forEach(table => console.log(`  - ${table}`));
      }
    }

    // Check for RLS policies on key tables
    console.log('\n\n🔒 ROW LEVEL SECURITY POLICIES:');
    console.log('=' .repeat(50));

    const keyTables = [
      'companies', 'jobs', 'resumes', 'applications', 
      'employer_credits', 'credit_ledger'
    ];

    for (const tableName of keyTables) {
      const { data: policies, error: policiesError } = await supabase
        .rpc('get_policies_for_table', { table_name: tableName })
        .select('*');

      if (!policiesError && policies && policies.length > 0) {
        console.log(`\n${tableName}:`);
        policies.forEach((policy: any) => {
          console.log(`  - ${policy.policyname} (${policy.cmd})`);
        });
      }
    }

    // Check storage buckets
    console.log('\n\n📦 STORAGE BUCKETS:');
    console.log('=' .repeat(50));

    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (bucketsError) {
      console.error('Error fetching buckets:', bucketsError);
    } else if (buckets) {
      buckets.forEach(bucket => {
        console.log(`  - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
      });
    }

    // Check for functions/RPC
    console.log('\n\n⚡ RPC FUNCTIONS:');
    console.log('=' .repeat(50));

    const { data: functions, error: functionsError } = await supabase
      .from('information_schema.routines')
      .select('routine_name, routine_schema')
      .eq('routine_schema', 'public')
      .eq('routine_type', 'FUNCTION');

    if (functionsError) {
      console.error('Error fetching functions:', functionsError);
    } else if (functions) {
      functions.forEach(func => {
        console.log(`  - ${func.routine_name}`);
      });
    }

    // Test specific table existence
    console.log('\n\n✅ TABLE EXISTENCE CHECK:');
    console.log('=' .repeat(50));

    const tablesToCheck = [
      'companies', 'jobs', 'resumes', 'applications',
      'employer_credits', 'credit_ledger'
    ];

    for (const table of tablesToCheck) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`  ❌ ${table}: Not found or error (${error.message})`);
      } else {
        console.log(`  ✅ ${table}: Exists (${count || 0} rows)`);
      }
    }

  } catch (error) {
    console.error('Error checking schema:', error);
  }
}

// Create a helper RPC function to get policies
const createGetPoliciesFunction = `
CREATE OR REPLACE FUNCTION get_policies_for_table(table_name text)
RETURNS TABLE(
  policyname text,
  tablename text,
  cmd text,
  qual text,
  with_check text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pol.polname::text as policyname,
    cls.relname::text as tablename,
    CASE pol.polcmd
      WHEN 'r' THEN 'SELECT'
      WHEN 'a' THEN 'INSERT'
      WHEN 'w' THEN 'UPDATE'
      WHEN 'd' THEN 'DELETE'
      WHEN '*' THEN 'ALL'
      ELSE pol.polcmd::text
    END as cmd,
    pg_get_expr(pol.polqual, pol.polrelid)::text as qual,
    pg_get_expr(pol.polwithcheck, pol.polrelid)::text as with_check
  FROM pg_policy pol
  JOIN pg_class cls ON pol.polrelid = cls.oid
  WHERE cls.relname = table_name;
END;
$$ LANGUAGE plpgsql;
`;

// Run the check
checkSupabaseSchema().then(() => {
  console.log('\n\n💡 To create the helper function for checking policies, run this SQL in Supabase:');
  console.log(createGetPoliciesFunction);
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});