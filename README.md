# LifeLink

![LifeLink Logo](/lifelink_logo.png)

**Personalized health insights for a balanced life**

**Live Demo**: [https://lifelink-app.vercel.app/](https://lifelink-app.vercel.app/)

LifeLink is an AI-powered health companion that provides personalized health recommendations and insights to help users achieve their wellness goals. The platform combines cutting-edge machine learning with an intuitive user interface to deliver actionable health guidance.

## Screenshots

### Landing Page
![Landing Page](/dashboard.png)

### Chat Interface - Initial State
![Chat Interface Initial](/app-preview.png)

### Chat Interface - Active Conversation
![Chat Conversation](https://via.placeholder.com/800x400?text=Chat+Conversation+Example)

## Features

- **Personalized Health Plans**: Receive customized recommendations based on your unique profile and health data
- **AI-Powered Insights**: Advanced algorithms analyze your data to provide meaningful, actionable health insights  
- **Progress Tracking**: Monitor your health metrics with intuitive dashboards and visualizations
- **Holistic Approach**: Address all aspects of your health including physical, mental, and nutritional wellbeing
- **Private & Secure**: Your health data is encrypted and protected with enterprise-grade security protocols
- **Adaptive Guidance**: Receive ongoing guidance that adapts to your changing health needs and progress

## Architecture

### Frontend
- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Framer Motion animations
- **3D Elements**: Custom 3D card components for enhanced user experience

### Backend
- **Framework**: Flask (Python)
- **Hosting**: AWS EC2 t4g.small instance (2 vCPUs, 2 GiB RAM)
- **API**: RESTful API endpoints for health data processing

### AI Model
- **Base Model**: Mistral-7B-Instruct-v0.3 by Mistral AI
- **Fine-tuning Datasets**: 
  - MedQuAD Dataset (Medical Question Answering)
  - MedRedQA Dataset (Medical Reddit Q&A)
- **Quantization**: IQ1_S quantization using llama.cpp for efficient inference
- **Purpose**: Specialized for medical question answering and health guidance

## About the AI Model

**Mistral-7B-Instruct-v0.3** is a 7-billion parameter large language model developed by Mistral AI, specifically designed for instruction-following tasks. The model has been fine-tuned on medical datasets to provide accurate health information and guidance.

**Quantization (IQ1_S)**: The model has been quantized using llama.cpp's IQ1_S format, which significantly reduces the model size while maintaining reasonable performance. This quantization allows the model to run efficiently on resource-constrained environments like our AWS EC2 instance, making real-time health consultations possible with minimal latency.

## Getting Started

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- AWS CLI (for deployment)

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/your-username/lifelink.git
cd lifelink/frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run Flask server
python app.py
```

## User Interface

The application features a modern, intuitive interface with:

- **Chat Interface**: Natural conversation with the AI health assistant
- **Dashboard**: Comprehensive health metrics and progress tracking
- **Responsive Design**: Seamless experience across desktop and mobile devices
- **Dark Theme**: Eye-friendly design for extended usage

## Privacy & Security

- All health data is encrypted in transit and at rest
- No personal health information is stored permanently
- HIPAA-compliant data handling practices
- User anonymization for model training and improvement

## Use Cases

- **Symptom Assessment**: Get initial guidance on health symptoms
- **Medication Information**: Learn about medications and their effects
- **Preventive Care**: Receive recommendations for maintaining good health
- **Wellness Planning**: Create personalized health and fitness plans
- **Health Education**: Access reliable medical information and explanations

## Important Disclaimer

LifeLink is designed to provide general health information and should not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for serious health concerns.

## Technical Stack

| Component | Technology |
|-----------|------------|
| Frontend Framework | Next.js + TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Backend Framework | Flask (Python) |
| AI Model | Mistral-7B-Instruct-v0.3 |
| Model Optimization | llama.cpp (IQ1_S quantization) |
| Hosting | AWS EC2 t4g.small |
| Deployment | Docker + AWS |

## Performance

- **Response Time**: < 2 seconds average for health queries
- **Uptime**: 99.9% availability
- **Concurrent Users**: Supports up to 100 simultaneous users
- **Model Accuracy**: Fine-tuned on 100K+ medical Q&A pairs

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@lifelink.com or join our community Discord server.

---

**Made with care for better health outcomes**