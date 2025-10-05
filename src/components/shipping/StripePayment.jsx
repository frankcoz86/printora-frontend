import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Lock } from 'lucide-react';

const StripePayment = ({ totalAmount, onSuccessfulPayment, isProcessing }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Assicurati che l'URL di ritorno sia corretto per la tua app
                return_url: `${window.location.origin}/payment-success`,
            },
            redirect: 'if_required'
        });

        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message);
            } else {
                setMessage("An unexpected error occurred.");
            }
            toast({
                title: "Errore di Pagamento",
                description: error.message || "Si è verificato un errore imprevisto.",
                variant: "destructive",
            });
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            toast({
                title: "Pagamento Riuscito!",
                description: "Il tuo pagamento è stato elaborato con successo.",
            });
            onSuccessfulPayment(paymentIntent);
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "tabs"
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" options={paymentElementOptions} />
            <Button disabled={isLoading || !stripe || !elements || isProcessing} id="submit" className="w-full mt-4 h-12 text-lg">
                <span id="button-text">
                    {isLoading || isProcessing ? (
                        <Loader2 className="animate-spin mr-2" />
                    ) : (
                        <Lock className="w-4 h-4 mr-2" />
                    )}
                    {isLoading || isProcessing ? 'Elaborazione...' : `Paga €${totalAmount.toFixed(2)}`}
                </span>
            </Button>
            {message && <div id="payment-message" className="text-red-500 text-sm mt-2">{message}</div>}
        </form>
    );
};

export default StripePayment;