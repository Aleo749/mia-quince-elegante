-- Create table for RSVP groups (each submission is a group)
CREATE TABLE public.rsvp_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for individual guests
CREATE TABLE public.rsvp_guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.rsvp_groups(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    attending BOOLEAN NOT NULL DEFAULT false,
    table_number INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.rsvp_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp_guests ENABLE ROW LEVEL SECURITY;

-- Create policies for public insert (anyone can submit RSVP, including anonymous users)
CREATE POLICY "Anyone can create rsvp groups" 
ON public.rsvp_groups 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can create guests" 
ON public.rsvp_guests 
FOR INSERT 
TO public
WITH CHECK (true);

-- Create policies for authenticated users to read all (admin panel)
CREATE POLICY "Authenticated users can view all groups" 
ON public.rsvp_groups 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view all guests" 
ON public.rsvp_guests 
FOR SELECT 
TO authenticated
USING (true);

-- Create policy for authenticated users to update guests (assign tables)
CREATE POLICY "Authenticated users can update guests" 
ON public.rsvp_guests 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policy for authenticated users to delete
CREATE POLICY "Authenticated users can delete groups" 
ON public.rsvp_groups 
FOR DELETE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete guests" 
ON public.rsvp_guests 
FOR DELETE 
TO authenticated
USING (true);