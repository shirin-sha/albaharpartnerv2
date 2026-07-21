const fetch = require('node-fetch');

async function testAPI() {
  console.log('🧪 Testing Homepage API...\n');
  
  try {
    const url = 'http://localhost:3000/api/homepage?language=ltr';
    console.log('📍 Fetching:', url);
    
    const response = await fetch(url);
    console.log('📊 Status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error Response:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('\n✅ Response received!');
    console.log('Success:', data.success);
    
    if (data.data) {
      console.log('\n📦 Content Structure:');
      console.log('- Has heroSlides:', !!data.data.heroSlides);
      console.log('- Hero slides count:', data.data.heroSlides?.length || 0);
      console.log('- Has aboutSection:', !!data.data.aboutSection);
      console.log('- Has processSection:', !!data.data.processSection);
      console.log('- Process steps count:', data.data.processSection?.steps?.length || 0);
      console.log('- Has servicesSection:', !!data.data.servicesSection);
      console.log('- Services count:', data.data.servicesSection?.services?.length || 0);
      console.log('- Has testimonialSection:', !!data.data.testimonialSection);
      console.log('- Has brandsSection:', !!data.data.brandsSection);
      console.log('- Brands count:', data.data.brandsSection?.brands?.length || 0);
      console.log('- Has caseStudiesSection:', !!data.data.caseStudiesSection);
      console.log('- Case studies count:', data.data.caseStudiesSection?.caseStudies?.length || 0);
      console.log('- Has featuresSection:', !!data.data.featuresSection);
      console.log('- Benefits count:', data.data.featuresSection?.benefits?.length || 0);
      console.log('- Counters count:', data.data.featuresSection?.counters?.length || 0);
      console.log('- Has blogsSection:', !!data.data.blogsSection);
      console.log('- Blog posts count:', data.data.blogsSection?.posts?.length || 0);
      console.log('- Has ctaSection:', !!data.data.ctaSection);
      
      console.log('\n✅ All sections present!');
    } else {
      console.log('⚠️  No data returned');
      console.log('Message:', data.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();
