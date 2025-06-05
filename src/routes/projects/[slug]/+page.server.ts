import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params;

  try {
    // Fetch project details
    const { data: project, error: projectError } = await supabase
      .from('project_details')
      .select(`
        *,
        project_testimonials (
          id,
          client_name,
          client_title,
          client_company,
          client_image,
          testimonial_text,
          rating
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (projectError || !project) {
      throw error(404, 'Project not found');
    }

    // Parse JSON fields
    const projectData = {
      ...project,
      technologies: project.technologies || [],
      images: project.images || [],
      videos: project.videos || [],
      key_features: project.key_features || [],
      challenges_solved: project.challenges_solved || [],
      results_achieved: project.results_achieved || [],
      meta_keywords: project.meta_keywords || []
    };

    return {
      project: projectData
    };
  } catch (err) {
    console.error('Error fetching project:', err);
    throw error(404, 'Project not found');
  }
}; 