export function initSignupForm() {
  const { createClient } = window.supabase;

  const supabaseUrl = 'https://owiszgzxvfcmldeawhpf.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93aXN6Z3p4dmZjbWxkZWF3aHBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2OTY5MTYsImV4cCI6MjA1OTI3MjkxNn0.l1QOPd9zR5rgeJvpPs1cZx-A1Ly2kPLRY-IXqt_soFA';
  const supabase = createClient(supabaseUrl, supabaseKey);

  const form = document.getElementById('signup-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;
    const location = document.getElementById('location').value;

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      document.getElementById('response-message').textContent = `Fel vid registrering: ${error.message}`;
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      document.getElementById('response-message').textContent = "Registrering skickades, men användar-ID saknas.";
      return;
    }

    const { error: insertError } = await supabase
      .from('users')
      .insert([{ email, phone, location, user_id: userId }]);

    if (insertError) {
      document.getElementById('response-message').textContent = `Fel vid sparning av användardata: ${insertError.message}`;
    } else {
      document.getElementById('response-message').textContent = '✅ Registrering lyckades! Vänligen bekräfta din e-post.';
      setTimeout(() => {
        window.location.href = 'components/thankyou.html'; // Ändra efter behov
      }, 1500);
    }
  });
}
